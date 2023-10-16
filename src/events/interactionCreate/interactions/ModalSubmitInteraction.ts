import { ModalSubmitFields, ModalSubmitInteraction } from 'discord.js';

import SuperClient from '../../../root/SuperClient';
import Blacklist from '../../../service/adminPanel/Blacklisting';
import { clean, discordDate } from '../../../root/Util';
import Emojis from '../../../res/Emojis';
import { TestedModalSubitFields } from '../../../service/adminPanel';

/**
 * The function for the ModalSubmitInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
export default async function modalSubmitInteraction(
  client: SuperClient,
  interaction: ModalSubmitInteraction,
): Promise<void> {
  if (interaction.customId.startsWith('blacklist')) {
    const data: ModalSubmitFields = interaction.fields;

    const blacklist: Blacklist = (
      await client.Services.AdminPanel(client, interaction.guild.id, interaction.channel.id)
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
  }
}
