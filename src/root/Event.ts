import { Collection, BaseInteraction, ModalSubmitFields } from 'discord.js';

import Command from './Command';
import Client from './Client';
import { clean, discordDate, log } from './Util';
import Context from './Context';
import { CoolDownsQueueElement } from './CoolDownManager';
import { InterferingQueueElement } from './InterferingManager';
import { Monitoring as APIndex, TestedModalSubitFields } from '../service/adminPanel/Monitoring';
import Blacklist from '../service/adminPanel/Blacklisting';
import Emojis from '../res/Emojis';
import CommandsPrivilegesSetting from '../service/adminPanel/CommandsPrivilegesSetting';
import postExec from '../post.exec';

/**
 * The model of a callback function for an event.
 *
 * @param args The command args.
 */
export type EventCallback = (...args: any[]) => void;

/**
 * A default callback function used when nothing is set.
 *
 * @returns Nothing.
 */
export async function callbackDefault(): Promise<void> {
  return void setTimeout(() => null);
}

/**
 * Represents an Event on client service.
 */
export default class Event {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The event name.
   */
  public readonly name: string;
  /**
   * The callback function.
   */
  public callback: EventCallback;

  /**
   * The constructor of the event.
   *
   * @param client The client instance.
   * @param name The event name.
   */
  constructor(client: Client, name: string) {
    this.client = client;
    this.name = name;
    this.callback = callbackDefault;
  }
}

/**
 * The collection that includes the default callback functions for basic events.
 */
export const defaultEventsCb: Collection<string, EventCallback> = new Collection();

defaultEventsCb.set('ready', async (client: Client): Promise<void> => {
  log(`Logged in as ${client.user.tag}.`);

  await (
    await client.Services.AdminPanel(client, '1139950254322626751', '1113177643710423060')
  ).monitoring.refreshChannel();
  await client.supportGuild.refreshSupport();
  client.blacklist = (await client.Servers.Core.getCore()).blacklist;

  void postExec(client);
});

defaultEventsCb.set('interactionCreate', async (client: Client, interaction: BaseInteraction): Promise<void> => {
  if (interaction.user.id in client.blacklist) return;

  if (interaction.isButton() || interaction.isAnySelectMenu()) {
    if ((interaction.customId as string).startsWith('autoDefer')) await interaction.deferUpdate().catch(clean);
  }
  if (interaction.isChatInputCommand()) {
    const command: Command | undefined = client.Commands.getCommand(interaction);
    if (!command) return;
    const ctx: Context = new Context(interaction.channel, command, interaction, interaction.user);
    ctx.command = command;
    ctx.interaction = interaction;
    command.ctx = ctx;
    await ctx.loadLanguage();

    const activeCoolDowns: CoolDownsQueueElement[] = client.Commands.CoolDowns.coolDowns(
      interaction.user.id,
      command.data.fullName,
    );
    const activeInterfering: InterferingQueueElement[] = client.Commands.Interfering.interfering(
      interaction.user.id,
      ...(command.data.interferingCommands || []),
    );

    if (activeCoolDowns.length > 0) {
      const finishTime: string = String(activeCoolDowns[0][1] / 1000).split('.')[0];
      const translated: string = ctx.translate('activeCoolDown', command.data.fullName, finishTime);

      return void (await ctx.reply(translated));
    }
    if (activeInterfering.length > 0) {
      const interferingList: string = activeInterfering
        .map((i: InterferingQueueElement): string => `</${i[0]}:${i[1].commandId}>`)
        .join(', ');
      const translated: string = ctx.translate('activeInterfering', interferingList);

      return void (await ctx.reply(translated));
    }

    const authorized: boolean = await command.isAuthorized(interaction);
    if (!authorized) return;

    client.Commands.Interfering.registerInterfering(interaction.user.id, command.data.fullName, interaction);
    client.Commands.CoolDowns.registerCoolDown(interaction.user.id, command.data.fullName, command.data.coolDown || 0);

    await command.execute(client, interaction, ctx);
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('blacklist')) {
      const data: ModalSubmitFields = interaction.fields;

      const blacklist: Blacklist = (
        await client.Services.AdminPanel(client, interaction.channel.id, interaction.guild.id)
      ).blacklisting;

      if (interaction.customId === 'blacklist_add') {
        const tested: TestedModalSubitFields = await blacklist.validAddModal(data, interaction.member.user.id);
        await client.printBack(
          tested,
          {
            valid: `Object \`${tested.name}\` **successfully added** to the blacklist.`,
            invalid: `Object \`${tested.name}\` **cannot be added** to the blacklist.`,
          },
          interaction,
        );

        if (tested.valid) await client.Servers.Core.blacklistElement(tested);
      } else if (interaction.customId === 'blacklist_remove') {
        const tested: TestedModalSubitFields = await blacklist.validRemoveModal(data);
        await client.printBack(
          tested,
          {
            valid: `Object \`${tested.name}\` **successfully removed** from the blacklist.`,
            invalid: `Object \`${tested.name}\` **cannot be removed** from the blacklist.`,
          },
          interaction,
        );

        if (tested.valid) await client.Servers.Core.unblacklistElement(tested.data.get('index').value);
      }
    } else if (interaction.customId.startsWith('commandsPrivileges')) {
      const data: ModalSubmitFields = interaction.fields;

      const commandsPrivileges: CommandsPrivilegesSetting = (
        await client.Services.AdminPanel(client, interaction.channel.id, interaction.guild.id)
      ).commandPrivilegesSetting;

      if (['unique', 'forbidden'].includes(interaction.customId.split('_')[1])) {
        const tested: TestedModalSubitFields = await commandsPrivileges.validCommandEditForbiddenModal(data);

        let finalMessage: string;

        if (tested.valid) {
          finalMessage = `<t:${discordDate()}:T> | ${Emojis.coloredSettings}${Emojis.coloredCheck} | Command \`${
            tested.name
          }\` **successfully** __edited__.`;

          await client.Servers.Core.editCommandPrivileges(tested);
          if (tested.errors.length > 0) finalMessage += `\n\`Warnings:\`\n>>> ${tested.errors.join('\n')}`;
        } else {
          finalMessage = `<t:${discordDate()}:T> | ${Emojis.coloredSettings}${Emojis.coloredCancel} | Command \`${
            tested.name
          }\` **cannot be** __found__.`;

          if (tested.errors.length > 0) finalMessage += `\n\`Errors:\`\n>>> ${tested.errors.join('\n')}`;
        }

        await interaction.reply({ content: finalMessage, ephemeral: true }).catch(clean);
      }
    }
  }
});
