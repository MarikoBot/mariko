import SuperClient from '../../../root/SuperClient';
import { ButtonInteraction } from 'discord.js';
import { clean } from '../../../root/Util';
import { Monitoring } from '../../../service/adminPanel/Monitoring';

/**
 * The function for the ButtonInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
export default async function buttonInteraction(client: SuperClient, interaction: ButtonInteraction): Promise<void> {
  if ((interaction.customId as string).startsWith('autoDefer')) await interaction.deferUpdate().catch(clean);

  if (interaction.customId.startsWith('monitoring')) {
    const monitoring: Monitoring = (
      await client.Services.AdminPanel(client, interaction.guild.id, interaction.channel.id)
    ).monitoring;

    await monitoring.handle(interaction);
  }
}
