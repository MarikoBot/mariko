"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainEmbed = exports.panelButtons = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../../root/Util");
const index_1 = require("../index");
/**
 * The number of elements in the blacklist page.
 */
const eltPerPage = 12;
/**
 * The list of buttons for the panel.
 * @param page The page to display.
 * @param elements The number of elements in the blacklist.
 * @returns The list of buttons.
 */
const panelButtons = (page, elements) => [
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:previous:1146808689534177413>')
        .setCustomId(`adminpanel_blacklist_pageprevious_${page}`)
        .setStyle(v10_1.ButtonStyle.Primary)
        .setDisabled(!page),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:add:1146770731372400690>')
        .setCustomId('adminpanel_blacklist_add')
        .setStyle(v10_1.ButtonStyle.Success),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:remove:1146770742789287976>')
        .setCustomId('adminpanel_blacklist_remove')
        .setStyle(v10_1.ButtonStyle.Danger)
        .setDisabled(!elements),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:next:1146808693946581185>')
        .setCustomId(`adminpanel_blacklist_pagenext_${page}`)
        .setStyle(v10_1.ButtonStyle.Primary)
        .setDisabled(elements - page * eltPerPage <= eltPerPage),
];
exports.panelButtons = panelButtons;
/**
 * Get the current panel embed with the blacklist.
 * @param client The client.
 * @param color The color name for the embed.
 * @param page The page number.
 * @returns The built embed.
 */
const mainEmbed = async (client, color, page = 0) => {
    let colorValue = Util_1.Colors.DARK;
    if (color)
        colorValue = Util_1.Colors[color];
    const blacklist = (await client.Server.Core.getBlacklist());
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(colorValue)
        .setDescription(`# <:shieldc:1144631939869982813> Blacklist Panel\n*Use the buttons below to add or remove elements and navigate in the pages.*`)
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
     * Generate the interaction message options to reply with the given page.
     * @param page The page to set.
     * @returns The interaction reply options.
     */
    async messageOptions(page) {
        return {
            embeds: [await (0, exports.mainEmbed)(this.client, 'RED', page)],
            components: (0, index_1.generatePanelRows)((0, exports.panelButtons)(page, (await this.client.Server.Core.getBlacklist()).length)),
            ephemeral: true,
        };
    }
    /**
     * Generates the blacklist panel.
     * @returns Nothing.
     */
    async generate() {
        await this.displayPage(0);
    }
    /**
     * Display another page of the blacklist.
     * @param page The page to display.
     * @returns Nothing.
     */
    async displayPage(page) {
        if (!this.ctx.btn || !this.ctx.btn.message) {
            let generatedMessage = await this.ctx.btn
                .reply(await this.messageOptions(0))
                .catch(Util_1.caught);
            if (generatedMessage instanceof discord_js_1.InteractionResponse)
                generatedMessage = await generatedMessage.fetch().catch(Util_1.caught);
            if (!generatedMessage)
                return;
        }
        else {
            const generatedOptions = await this.messageOptions(page);
            await this.ctx.btn.reply(generatedOptions).catch(Util_1.caught);
        }
    }
    /**
     * The function that handle the blacklist ephemeral panel.
     */
    async handle(inter) {
        if (inter.isButton()) {
            const action = inter.customId.split('_')[2];
            if (action.startsWith('page')) {
                const currentPage = Number(this.ctx.btn.message.components[0].components[0].customId.split('_').at(-1));
                await this.displayPage(currentPage + (action.endsWith('previous') ? -1 : 1));
            }
        }
    }
}
exports.default = default_1;
