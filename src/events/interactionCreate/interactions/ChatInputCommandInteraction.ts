import Command from '../../../root/Command';
import Context from '../../../root/Context';
import { CoolDownsQueueElement } from '../../../root/CoolDownManager';
import { InterferingQueueElement } from '../../../root/InterferingManager';
import SuperClient from '../../../root/SuperClient';
import { ChatInputCommandInteraction } from 'discord.js';

/**
 * The function for the ChatInputCommandInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
export default async function chatInputCommandInteraction(
  client: SuperClient,
  interaction: ChatInputCommandInteraction,
): Promise<void> {
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
}
