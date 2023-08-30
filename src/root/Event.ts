import { Collection, BaseInteraction } from 'discord.js';

import Command from './Command';
import Client from './Client';
import { caught, log } from './Util';
import Context from './Context';
import { CoolDownsQueueElement } from './CoolDownManager';
import { InterferingQueueElement } from './InterferingManager';
import { Index as APIndex } from '../service/adminpanel';

/**
 * The model of a callback function for an event.
 * @param args The command args.
 */
export type EventCallback = (...args: any[]) => void;

/**
 * A default callback function used when nothing is set.
 * @param args The command args.
 * @returns Void.
 */
export async function callbackDefault(...args: any[]): Promise<void> {
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

  await (await client.Services.AdminPanel(client, '1139950254322626751', '1113177643710423060')).refreshChannel();
});

defaultEventsCb.set('interactionCreate', async (client: Client, interaction: BaseInteraction): Promise<void> => {
  if (interaction.isButton() || interaction.isAnySelectMenu()) {
    if ((interaction.customId as string).startsWith('autodefer')) {
      await interaction.deferUpdate().catch(caught);
    }
    if (interaction.isButton() && (interaction.customId as string).includes('adminpanel')) {
      const panel: APIndex = await client.Services.AdminPanel(client, interaction.channel.id, interaction.guild.id);
      await panel.handle(interaction);
    }
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
    // Code will be here.
  }
});
