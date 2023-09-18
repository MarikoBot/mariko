"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainEmbed = exports.panelButtons = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../../root/Util");
const index_1 = require("../index");
const ClientConfig_1 = require("../../../res/ClientConfig");
const Emojis_1 = require("../../../res/Emojis");
/**
 * The number of elements in the blacklist page.
 */
const eltPerPage = 12;
/**
 * The list of buttons for the panel.
 * @param elements The number of elements in the blacklist.
 * @returns The list of buttons.
 */
const panelButtons = (elements) => {
    const buttonsDisabled = elements <= eltPerPage;
    return [
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightBack)
            .setCustomId(`blacklistPanel_previousPage`)
            .setStyle(v10_1.ButtonStyle['Primary'])
            .setDisabled(buttonsDisabled),
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightAdd)
            .setCustomId('adminPanel_blacklist_add')
            .setStyle(v10_1.ButtonStyle['Success']),
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightCancel)
            .setCustomId('adminPanel_blacklist_remove')
            .setStyle(v10_1.ButtonStyle['Danger'])
            .setDisabled(!elements),
        new discord_js_1.ButtonBuilder()
            .setEmoji(Emojis_1.default.lightNext)
            .setCustomId(`blacklistPanel_nextPage`)
            .setStyle(v10_1.ButtonStyle['Primary'])
            .setDisabled(buttonsDisabled),
    ];
};
exports.panelButtons = panelButtons;
/**
 * Get the current panel embed with the blacklist.
 * @param blacklist The blacklist.
 * @param color The color name for the embed.
 * @param page The page number.
 * @returns The built embed.
 */
const mainEmbed = async (blacklist, color, page = 0) => {
    let colorValue = Util_1.Colors.DARK;
    if (color)
        colorValue = Util_1.Colors[color];
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(colorValue)
        .setDescription(`# Blacklist Panel\n*Use the buttons below to add or remove elements and navigate in the pages.*`)
        .setTimestamp(Date.now())
        .setFooter({ text: 'Last refresh date' });
    if (blacklist.length < eltPerPage * page || blacklist.length === 0) {
        embed.addFields({ name: 'No element to display here.', value: "*It's calm here, and that is nice.*" });
    }
    else {
        for (let i = eltPerPage * page; i < eltPerPage * (page + 1); i++) {
            if (i >= blacklist.length)
                break;
            const blElement = blacklist[i];
            embed.addFields({
                name: `**[ID ${i}]** ${blElement.type}: ${blElement.id}`,
                value: `\`\`\`diff\n- ${blElement.info}\n\`\`\`` +
                    `**- Commands:** ${typeof blElement.commands === 'string' ? blElement.commands : blElement.commands.join(', ')}\n` +
                    `**\\- Date:** <t:${(0, Util_1.discordDate)(blElement.date)}:F>`,
                inline: true,
            });
        }
    }
    return embed;
};
exports.mainEmbed = mainEmbed;
/**
 * The class that includes all the blacklist panel functions.
 */
class default_1 {
    /**
     * The client instance.
     */
    client;
    /**
     * The context instance.
     */
    ctx;
    /**
     * The constructor of the blacklist ephemeral panel.
     * @param client The client instance.
     * @param ctx The context of the panel.
     */
    constructor(client, ctx) {
        this.client = client;
        this.ctx = ctx;
    }
    /**
     * Get the current blacklist.
     */
    get blacklist() {
        return this.client.Server.Core.getBlacklist();
    }
    /**
     * Generate the interaction message options to reply with the given page.
     * @param page The page to set.
     * @returns The interaction reply options.
     */
    async messageOptions(page) {
        return {
            embeds: [await (0, exports.mainEmbed)(await this.blacklist, 'RED', page)],
            components: (0, index_1.generatePanelRows)((0, exports.panelButtons)((await this.client.Server.Core.getBlacklist()).length)),
            ephemeral: true,
        };
    }
    /**
     * Generates the blacklist panel.
     * @returns Nothing.
     */
    async generate() {
        await this.handlePagination(this.ctx.btn);
    }
    /**
     * The function that handle the blacklist ephemeral panel.
     * @param inter The associated interaction.
     * @returns Nothing.
     */
    async handle(inter) {
        if (inter.isButton()) {
            const action = inter.customId.split('_')[2];
            if (action === 'add')
                await this.displayAddModal(inter);
            if (action === 'remove')
                await this.displayRemoveModal(inter);
        }
    }
    /**
     * Handle the pagination menu to display blacklisted users.
     * @param inter The interaction associated.
     * @returns Nothing.
     */
    async handlePagination(inter) {
        let pageOptions = (await this.messageOptions(0));
        let panel = await inter.reply(pageOptions);
        if (!panel)
            return;
        panel = (await panel.fetch().catch(Util_1.clean));
        if (!panel)
            return;
        const collectorOptions = {
            filter: (buttonInteraction) => buttonInteraction.customId.endsWith('Page'),
            time: 30000,
        };
        let i = 0;
        let loop = true;
        while (loop) {
            const collector = await panel.awaitMessageComponent(collectorOptions).catch(Util_1.clean);
            if (!collector) {
                loop = false;
                break;
            }
            i += { previousPage: -1, nextPage: 1 }[collector.customId.split('_')[1]];
            const maxPageIndex = Math.floor((await this.blacklist).length / eltPerPage);
            if (i < 0)
                i = maxPageIndex;
            if (i > maxPageIndex)
                i = 0;
            pageOptions = (await this.messageOptions(i));
            delete pageOptions['ephemeral'];
            await panel.edit(pageOptions).catch(Util_1.clean);
            await collector.deferUpdate().catch(Util_1.clean);
        }
    }
    /**
     * Show the modal to add an element.
     * @param inter The associated interaction.
     * @returns Nothing.
     */
    async displayAddModal(inter) {
        const modal = this.ctx.transformModalData({
            customId: 'blacklist_add',
            title: '➕ Add an element to the blacklist',
            fields: [
                {
                    label: 'The ID of the guild/server',
                    minLength: 18,
                    maxLength: 20,
                    placeholder: 'Right click the element to copy the ID.',
                    style: v10_1.TextInputStyle['Short'],
                    id: 'id',
                    required: true,
                },
                {
                    label: "If it's a guild or a user",
                    minLength: 4,
                    maxLength: 5,
                    placeholder: 'user/guild',
                    style: v10_1.TextInputStyle['Short'],
                    id: 'type',
                    required: true,
                    value: 'user',
                },
                {
                    label: 'The reason/additional info',
                    minLength: 10,
                    placeholder: '"This user is a threat."/"This guild is not good."',
                    style: v10_1.TextInputStyle['Paragraph'],
                    id: 'info',
                    required: true,
                },
                {
                    label: 'The commands to blacklist',
                    minLength: 3,
                    placeholder: '"all"/"command1, command2"',
                    style: v10_1.TextInputStyle['Paragraph'],
                    id: 'commands',
                    required: true,
                    value: 'all',
                },
            ],
        });
        await inter.showModal(modal).catch(Util_1.clean);
    }
    /**
     * Show the modal to remove an element.
     * @param inter The associated interaction.
     * @returns Nothing.
     */
    async displayRemoveModal(inter) {
        const modal = this.ctx.transformModalData({
            customId: 'blacklist_remove',
            title: '➖ Remove an element from the blacklist',
            fields: [
                {
                    label: 'The index of the element to remove.',
                    minLength: 1,
                    placeholder: 'This index is found on the panel, in the [].',
                    style: v10_1.TextInputStyle['Short'],
                    id: 'index',
                    required: true,
                },
                {
                    label: 'The reason/additional info',
                    minLength: 10,
                    placeholder: 'Why this user/guild should be un-blacklisted.',
                    style: v10_1.TextInputStyle['Paragraph'],
                    id: 'info',
                    required: true,
                },
            ],
        });
        await inter.showModal(modal).catch(Util_1.clean);
    }
    /**
     * Validate if the modal values are ready to be set in the database.
     * This function is for adding something to the blacklist.
     * @param fields The submitted fields.
     * @param authorId The author id of the modal.
     * @returns The formatted response for this function. If it's valid or not.
     */
    async validAddModal(fields, authorId) {
        const tested = {
            valid: true,
            errors: [],
            data: fields.fields,
            name: 'missing',
        };
        const idValue = fields.fields.get('id').value;
        const typeValue = fields.fields.get('type').value;
        const commandsValue = fields.fields.get('commands').value;
        const fetchedThing = (await (0, Util_1.IdToGuild)(this.client, idValue)) || (await (0, Util_1.IdToUser)(this.client, idValue)) || false;
        const fetchedType = fetchedThing ? fetchedThing.constructor.name.toLowerCase() : null;
        if (fetchedThing)
            tested.name = fetchedThing instanceof discord_js_1.User ? fetchedThing.username : fetchedThing.name || idValue;
        else
            tested.name = idValue;
        if (fetchedType) {
            if (fetchedType !== typeValue) {
                tested.valid = false;
                tested.errors.push(`${Emojis_1.default.coloredForbidden} Type **${typeValue}** cannot be associated with **${fetchedType}** object for \`${idValue}\`.`);
            }
        }
        else
            tested.errors.push(`${Emojis_1.default.coloredWarning} No **${typeValue}** was found for \`${idValue}\`. This warning can occur when the ${typeValue} is not available by the bot.`);
        if (!ClientConfig_1.default.commandsListRegexp.test(commandsValue)) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} \`${commandsValue}\` string must follow the below rule:\`\`\`fix\n${ClientConfig_1.default.commandsListRegexp}\`\`\`` +
                `Example:\`\`\`fix\ninfo, help, test fruits\`\`\`*(You can specify longer names to exclude only subcommands from the blacklisted entry.)*`);
        }
        if (!(await this.client.supportGuild.takesPriority(authorId, idValue))) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} You can't blacklist **${tested.name}** because they are equal or higher than you.`);
        }
        const blacklist = await this.client.Server.Core.getBlacklist();
        if (blacklist.map((e) => e.id).includes(idValue)) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} Object \`${tested.name}\` is already blacklisted. If you want to change informations, remove it before.`);
        }
        if (!['user', 'guild'].includes(typeValue)) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} Type **${typeValue}** must be type user or guild.`);
        }
        return tested;
    }
    /**
     * Validate if the modal values are able to remove something in the database.
     * This function is for adding something to the blacklist.
     * @param fields The submitted fields.
     * @returns The formatted response for this function. If it's valid or not.
     */
    async validRemoveModal(fields) {
        const tested = {
            valid: true,
            errors: [],
            data: fields.fields,
            name: 'missing',
        };
        const indexValue = fields.fields.get('index').value;
        tested.name = indexValue;
        if (!ClientConfig_1.default.numbersRegexp.test(indexValue)) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} \`${indexValue}\` value must be a number.`);
        }
        const blacklist = await this.client.Server.Core.getBlacklist();
        const blacklistLength = blacklist.length;
        if (Number(indexValue) > blacklistLength) {
            tested.valid = false;
            tested.errors.push(`${Emojis_1.default.coloredForbidden} There aren't as many elements in the blacklist. ` +
                `\`${indexValue}\` is out of range \`${0}-${blacklistLength - 1}\`.`);
        }
        tested.name = blacklist[Number(indexValue)].id;
        return tested;
    }
}
exports.default = default_1;
