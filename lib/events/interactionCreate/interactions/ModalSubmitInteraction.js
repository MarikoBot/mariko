"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The function for the ModalSubmitInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
async function modalSubmitInteraction(client, interaction) {
    if (interaction.customId.startsWith('blacklist')) {
        const data = interaction.fields;
        const blacklist = (await client.Services.AdminPanel(client, interaction.guild.id, interaction.channel.id)).blacklisting;
        if (interaction.customId === 'blacklist_add') {
            const tested = await blacklist.validAddModal(data, interaction.member.user.id);
            await client.printBack(tested, {
                valid: `Object \`${tested.name}\` **successfully added** to the blacklist.`,
                invalid: `Object \`${tested.name}\` **cannot be added** to the blacklist.`,
            }, interaction);
            if (tested.valid)
                await client.Servers.Core.blacklistElement(tested);
        }
        else if (interaction.customId === 'blacklist_remove') {
            const tested = await blacklist.validRemoveModal(data);
            await client.printBack(tested, {
                valid: `Object \`${tested.name}\` **successfully removed** from the blacklist.`,
                invalid: `Object \`${tested.name}\` **cannot be removed** from the blacklist.`,
            }, interaction);
            if (tested.valid)
                await client.Servers.Core.unblacklistElement(tested.data.get('index').value);
        }
    }
}
exports.default = modalSubmitInteraction;
