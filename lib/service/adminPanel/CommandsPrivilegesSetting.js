"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainEmbed = exports.panelButtons = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../root/Util");
const Monitoring_1 = require("./Monitoring");
const Emojis_1 = require("../../res/Emojis");
const Core_1 = require("../../models/Core");
const ClientConfig_1 = require("../../res/ClientConfig");
/**
 * The list of buttons for the panel.
 *
 * @param commandName The command name.
 * @returns The list of buttons.
 */
const panelButtons = (commandName) => {
    return [
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightPencil)
            .setCustomId(`commandsPrivileges_unique_${commandName.replace('_', '::')}`)
            .setStyle(v10_1.ButtonStyle['Success']),
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightPencil)
            .setCustomId(`commandsPrivileges_forbidden_${commandName.replace('_', '::')}`)
            .setStyle(v10_1.ButtonStyle['Danger']),
    ];
};
exports.panelButtons = panelButtons;
/**
 * Get the current panel embed with the command information displayed.
 *
 * @param commandPrivileges The command privileges.
 * @param fullName The command full name.
 * @param color The color name for the embed.
 * @returns The built embed.
 */
const mainEmbed = async (commandPrivileges, fullName, color) => {
    let colorValue = Util_1.Colors.DARK;
    if (color)
        colorValue = Util_1.Colors[color];
    return new discord_js_1.EmbedBuilder()
        .setColor(colorValue)
        .setFields(...Object.entries(commandPrivileges).map((privileges) => ({
        name: privileges[0],
        value: privileges[1].length
            ? privileges[1].map((value) => `\`${value}\``).join(' :: ')
            : 'No value',
        inline: false,
    })))
        .setTimestamp(Date.now())
        .setFooter({ text: 'Last refresh date' });
};
exports.mainEmbed = mainEmbed;
/**
 * The class that includes all the commands privileges functions.
 */
class CommandsPrivilegesSetting {
    /**
     * The client instance.
     */
    client;
    /**
     * The context instance.
     */
    ctx;
    /**
     * The constructor of the commands privileges panel.
     *
     * @param client The client instance.
     * @param ctx The context of the panel.
     */
    constructor(client, ctx) {
        this.client = client;
        this.ctx = ctx;
    }
    /**
     * The function that handle the commands privileges ephemeral panel.
     *
     * @param inter The associated interaction.
     * @returns Nothing.
     */
    async handle(inter) {
        const privileges = await this.client.Servers.Core.getCommandsPrivilegesList();
        if (inter.isButton()) {
            const action = inter.customId.split('_')[2];
            if (action === 'unique' || action === 'forbidden') {
                const commandName = inter.customId.split('_')[3].replace('::', '');
                await this.displayCommandEditModal(inter, privileges[commandName], action);
            }
        }
    }
    /**
     * Generate the interaction message options to reply with the given page.
     *
     * @param commandPrivileges The command privileges.
     * @param fullName The command full name.
     * @returns The interaction reply options.
     */
    async messageOptions(commandPrivileges, fullName) {
        return {
            embeds: [await (0, exports.mainEmbed)(commandPrivileges, fullName, 'YELLOW')],
            components: (0, Monitoring_1.generatePanelRows)((0, exports.panelButtons)(fullName)),
            ephemeral: true,
        };
    }
    /**
     * Send an embed with the command information on it.
     *
     * @param inter ModalSubmitInteraction
     * @param fullName The command full name.
     */
    async displayCommandEmbed(inter, fullName) {
        const privileges = await this.client.Servers.Core.getCommandsPrivilegesList();
        await inter.reply(await this.messageOptions(privileges[fullName], fullName)).catch(Util_1.clean);
    }
    /**
     * Display the modal to edit the command privileges (unique main).
     *
     * @param inter The associated interaction.
     * @param privileges The privileges for the command.
     * @param main The part of privileges to edit: forbidden privileges or unique privileges.
     * @returns Nothing.
     */
    async displayCommandEditModal(inter, privileges, main = 'unique') {
        const modal = this.ctx.transformModalData({
            customId: 'commandsPrivileges_edit',
            title: "🔎 Edit command - command's data",
            fields: [
                ...Core_1.commandPrivilegesKeys
                    .filter((privilege) => privilege.startsWith(main))
                    .map((privilege) => {
                    return {
                        label: privilege,
                        value: privilege in privileges ? (privileges[privilege].length ? privileges[privilege].join(', ') : '') : '',
                        style: v10_1.TextInputStyle['Paragraph'],
                        id: privilege,
                        required: false,
                    };
                }),
            ],
        });
        await inter.showModal(modal).catch(Util_1.clean);
    }
    /**
     * Validate if the modal values are able to get in the privileges.
     *
     * @param fields The submitted fields.
     * @returns The formatted response for this function. If it's valid or not.
     */
    async validCommandEditForbiddenModal(fields) {
        const tested = {
            valid: true,
            errors: [],
            data: fields.fields,
            name: 'forbidden',
        };
        const channelsValue = fields.fields.get(`forbiddenChannels`).value;
        const guildsValue = fields.fields.get(`forbiddenGuilds`).value;
        const rolesValue = fields.fields.get(`forbiddenRoles`).value;
        const usersValue = fields.fields.get(`forbiddenUsers`).value;
        const currentPrivileges = await this.client.Servers.Core.getExternalPrivileges('test fruit banana');
        const channelsOpposite = currentPrivileges.uniqueChannels;
        const guildsOpposite = currentPrivileges.uniqueGuilds;
        const rolesOpposite = currentPrivileges.uniqueRoles;
        const usersOpposite = currentPrivileges.uniqueUsers;
        for (const concept of ['channels', 'guilds', 'roles', 'users']) {
            let conceptValue = eval(`${concept}Value`);
            const conceptOpposite = eval(`${concept}Opposite`);
            if (!ClientConfig_1.default.idsListRegexp.test(conceptValue) || !ClientConfig_1.default.idsListRegexp.test(conceptOpposite)) {
                tested.valid = false;
                tested.errors.push(`${Emojis_1.default.coloredForbidden} \`${ClientConfig_1.default.idsListRegexp.test(conceptValue) ? conceptOpposite : conceptValue}\` string must follow the below rule:\`\`\`fix\n${ClientConfig_1.default.idsListRegexp}\`\`\`` +
                    `Example:\`\`\`fix\ninfo, help, test fruits\`\`\`*(You can specify longer names to exclude only subcommands from the blacklisted entry.)*`);
            }
            conceptValue = conceptValue.split(', ');
            for (const value of conceptValue) {
                if (conceptOpposite.includes(value)) {
                    tested.valid = false;
                    tested.errors.push(`${Emojis_1.default.coloredForbidden} The value \`${value}\` is present on both side of \`${concept}\` (forbidden + unique).`);
                }
            }
        }
        return tested;
    }
}
exports.default = CommandsPrivilegesSetting;
