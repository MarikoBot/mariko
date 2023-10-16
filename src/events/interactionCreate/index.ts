import SuperClient from '../../root/SuperClient';
import { BaseInteraction } from 'discord.js';
import chatInputCommandInteraction from './interactions/ChatInputCommandInteraction';
import modalSubmitInteraction from './interactions/ModalSubmitInteraction';
import buttonInteraction from './interactions/ButtonInteraction';
import anySelectMenuInteraction from './interactions/AnySelectMenuInteraction';

/**
 * The function for the interactionCreate event.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
export default async function interactionCreate(client: SuperClient, interaction: BaseInteraction): Promise<void> {
  if (interaction.user.id in client.blacklist) return;

  if (interaction.isChatInputCommand()) await chatInputCommandInteraction(client, interaction);
  if (interaction.isButton()) await buttonInteraction(client, interaction);
  if (interaction.isAnySelectMenu()) await anySelectMenuInteraction(client, interaction);
  if (interaction.isModalSubmit()) await modalSubmitInteraction(client, interaction);
}
