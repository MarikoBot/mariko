"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitoring = exports.generatePanelRows = exports.panelButtons = exports.emptyButton = exports.mainEmbed = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../root/Util");
const Emojis_1 = require("../../res/Emojis");
/**
 * Get the current panel embed.
 *
 * @param client The client.
 * @param color The color name for the embed.
 * @returns The built embed.
 */
const mainEmbed = async (client, color) => {
    let colorValue = Util_1.Colors.DARK;
    if (color)
        colorValue = Util_1.Colors[color];
    const guilds = (await client.guilds.fetch().catch(Util_1.clean)) || new discord_js_1.Collection();
    const users = client.users.cache || new discord_js_1.Collection();
    const players = await client.Servers.Player.collectionData.Model.countDocuments().exec();
    const premiums = await client.Servers.User.getSubsData();
    const blacklist = (await client.Servers.Core.getBlacklist());
    const incomes = premiums.totalIncomes.reduce((a, b) => a + b, 0);
    // noinspection JSUnresolvedReference
    return new discord_js_1.EmbedBuilder()
        .setColor(colorValue)
        .setDescription(`# ${Emojis_1.default.supportAdmin} Admin Panel\n*Click the refresh button to refresh data.*`)
        .setFields({
        name: 'Guilds',
        value: String(guilds.size),
        inline: true,
    }, {
        name: 'Users',
        value: String(users.size),
        inline: true,
    }, {
        name: 'Players',
        value: String(players),
        inline: true,
    }, {
        name: 'Premium incomes',
        value: `**${incomes}$ (${incomes * 0.95}€)**/m`,
        inline: true,
    }, {
        name: 'Blacklist',
        value: `**${blacklist.length}** elements`,
        inline: true,
    })
        .setTimestamp(Date.now())
        .setFooter({ text: 'Last refresh date' });
};
exports.mainEmbed = mainEmbed;
/**
 * An empty button for the panel.
 *
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
const emptyButton = (id) => new discord_js_1.ButtonBuilder()
    .setStyle(v10_1.ButtonStyle['Secondary'])
    .setDisabled(true)
    .setCustomId(`autoDefer_adminPanel_${id}`)
    .setEmoji('▪️');
exports.emptyButton = emptyButton;
/**
 * The list of buttons for the panel.
 */
exports.panelButtons = [
    new discord_js_1.ButtonBuilder().setEmoji(Emojis_1.default.lightRefresh).setCustomId('adminPanel_refresh').setStyle(v10_1.ButtonStyle['Primary']),
    new discord_js_1.ButtonBuilder().setEmoji(Emojis_1.default.lightPing).setCustomId('adminPanel_ping').setStyle(v10_1.ButtonStyle['Primary']),
];
/**
 * Generate the rows from the panel buttons list.
 *
 * @param buttons The buttons to display.
 * @returns The buttons list.
 */
function generatePanelRows(buttons) {
    const actionsRows = [];
    for (let i = 0; i < buttons.length; i++) {
        if (i % 5 === 0)
            actionsRows.push(new discord_js_1.ActionRowBuilder());
        actionsRows[actionsRows.length - 1].addComponents(buttons[i]);
    }
    for (let j = actionsRows[actionsRows.length - 1].components.length; j < 5; j++)
        actionsRows[actionsRows.length - 1].addComponents((0, exports.emptyButton)(String(j)));
    return actionsRows;
}
exports.generatePanelRows = generatePanelRows;
/**
 * The default class of the file.
 * Includes useful methods for getting assets.
 */
class Monitoring {
    /**
     * The client of the service.
     */
    client;
    /**
     * The message where the admin panel is sent.
     */
    message;
    /**
     * The context of the admin panel.
     */
    ctx;
    /**
     * The constructor of the monitoring panel.
     *
     * @param client The client instance.
     * @param ctx The context of the panel.
     */
    constructor(client, ctx) {
        this.client = client;
        this.ctx = ctx;
    }
    /**
     * Handle the admin panel interactions.
     *
     * @param inter The interaction associated.
     * @returns Nothing.
     */
    async handle(inter) {
        const id = inter.customId;
        const task = id.replace('autoDefer_', '').split('_').slice(1).join('_');
        this.ctx.btn = inter;
        switch (task) {
            case 'refresh':
                await this.refresh(inter);
                break;
            case 'ping':
                await this.ping(inter);
                break;
            default:
                break;
        }
    }
    /**
     * Resend/edit the panel to update information.
     *
     * @returns Nothing.
     */
    async refreshChannel() {
        let messages = await this.ctx.channel.messages.fetch().catch(Util_1.clean);
        if (!messages)
            return;
        messages = messages.filter((message) => message.author.id === this.client.user.id);
        const payload = {
            embeds: [await (0, exports.mainEmbed)(this.client)],
            components: generatePanelRows(exports.panelButtons),
        };
        if (!messages.first())
            await this.ctx.send(payload);
        else
            await this.ctx.edit(payload, messages.first(), false);
    }
    /**
     * Replies to the refresh button.
     *
     * @param inter The interaction associated.
     * @returns Nothing.
     */
    async refresh(inter) {
        await this.refreshChannel();
        await inter
            .reply({
            content: `<t:${(0, Util_1.discordDate)()}:T> | ${Emojis_1.default.coloredRefresh} | \`Refresh done.\``,
            ephemeral: true,
        })
            .catch(Util_1.clean);
    }
    /**
     * Replies to the refresh button.
     *
     * @param inter The interaction associated.
     * @returns Nothing.
     */
    async ping(inter) {
        const latency = Math.sqrt((Date.now() - inter.createdTimestamp) ** 2);
        const apiLatency = this.client.ws.ping;
        const stylizePing = (ping, strToFit) => {
            const languages = {
                '300': ['diff', '- '],
                '100': ['fix', ''],
                '0': ['diff', '+ '],
            };
            const language = languages[Object.entries(languages)
                .filter((l) => Number(l[0]) <= ping)
                .sort((a, b) => Number(a) - Number(b))
                .at(-1)[0]];
            return `\`\`\`${language[0]}\n${language[1]}${strToFit.replace('{ping}', String(ping))}\`\`\``;
        };
        await inter
            .reply({
            content: `<t:${(0, Util_1.discordDate)()}:T> | ${Emojis_1.default.coloredPing} | \`Ping calculated.\`\n` +
                `${stylizePing(latency, 'Latency: {ping} ms')}${stylizePing(apiLatency, 'API Latency: {ping} ms')}`,
            ephemeral: true,
        })
            .catch(Util_1.clean);
    }
}
exports.Monitoring = Monitoring;
