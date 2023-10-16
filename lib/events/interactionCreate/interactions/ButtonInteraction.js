"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../root/Util");
/**
 * The function for the ButtonInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
async function buttonInteraction(client, interaction) {
    if (interaction.customId.startsWith('autoDefer'))
        await interaction.deferUpdate().catch(Util_1.clean);
    if (interaction.customId.startsWith('monitoring')) {
        const monitoring = (await client.Services.AdminPanel(client, interaction.guild.id, interaction.channel.id)).monitoring;
        await monitoring.handle(interaction);
    }
}
exports.default = buttonInteraction;
