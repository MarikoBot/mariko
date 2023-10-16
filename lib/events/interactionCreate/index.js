"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChatInputCommandInteraction_1 = require("./interactions/ChatInputCommandInteraction");
const ModalSubmitInteraction_1 = require("./interactions/ModalSubmitInteraction");
const ButtonInteraction_1 = require("./interactions/ButtonInteraction");
const AnySelectMenuInteraction_1 = require("./interactions/AnySelectMenuInteraction");
/**
 * The function for the interactionCreate event.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
async function interactionCreate(client, interaction) {
    if (interaction.user.id in client.blacklist)
        return;
    if (interaction.isChatInputCommand())
        await (0, ChatInputCommandInteraction_1.default)(client, interaction);
    if (interaction.isButton())
        await (0, ButtonInteraction_1.default)(client, interaction);
    if (interaction.isAnySelectMenu())
        await (0, AnySelectMenuInteraction_1.default)(client, interaction);
    if (interaction.isModalSubmit())
        await (0, ModalSubmitInteraction_1.default)(client, interaction);
}
exports.default = interactionCreate;
