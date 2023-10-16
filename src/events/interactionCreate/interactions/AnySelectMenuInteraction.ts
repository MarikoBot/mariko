import SuperClient from '../../../root/SuperClient';
import { AnySelectMenuInteraction } from 'discord.js';
import { clean } from '../../../root/Util';

/**
 * The function for the AnySelectMenuInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
export default async function anySelectMenuInteraction(
  client: SuperClient,
  interaction: AnySelectMenuInteraction,
): Promise<void> {
  if ((interaction.customId as string).startsWith('autoDefer')) await interaction.deferUpdate().catch(clean);
}
