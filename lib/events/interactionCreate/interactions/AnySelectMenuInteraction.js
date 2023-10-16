"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../root/Util");
/**
 * The function for the AnySelectMenuInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
async function anySelectMenuInteraction(client, interaction) {
    if (interaction.customId.startsWith('autoDefer'))
        await interaction.deferUpdate().catch(Util_1.clean);
}
exports.default = anySelectMenuInteraction;
