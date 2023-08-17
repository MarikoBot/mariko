"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = exports.generatePanelRows = exports.panelButtons = exports.emptyButton = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../root/Util");
const Context_1 = require("../../root/Context");
/*
 * Display number of users, servers and players
 * Display premium stats
 * Display blacklist
 */
/**
 * An empty button for the panel.
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
const emptyButton = (id) => new discord_js_1.ButtonBuilder()
    .setStyle(v10_1.ButtonStyle.Secondary)
    .setDisabled(true)
    .setCustomId(`autodefer_adminpanel_${id}`)
    .setEmoji('▪️');
exports.emptyButton = emptyButton;
/**
 * The list of buttons for the panel.
 */
exports.panelButtons = [
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:refresh:1141781454511149196>')
        .setCustomId('autodefer_adminpanel_refresh')
        .setStyle(v10_1.ButtonStyle.Primary),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:ping:1141781630709665962>')
        .setCustomId('autodefer_adminpanel_ping')
        .setStyle(v10_1.ButtonStyle.Primary),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:blacklist:1141782168910180362>')
        .setCustomId('autodefer_adminpanel_blacklist')
        .setStyle(v10_1.ButtonStyle.Danger),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:settings:1141782142339260416>')
        .setCustomId('autodefer_adminpanel_settings')
        .setStyle(v10_1.ButtonStyle.Danger),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:flag:1141782136333017129>')
        .setCustomId('autodefer_adminpanel_status')
        .setStyle(v10_1.ButtonStyle.Danger),
    new discord_js_1.ButtonBuilder()
        .setEmoji('<:premium:1141782866578116700>')
        .setCustomId('autodefer_adminpanel_premium')
        .setStyle(v10_1.ButtonStyle.Success),
];
/**
 * Generate the rows from the panel buttons list.
 */
function generatePanelRows() {
    const actionsRows = [];
    for (let i = 0; i < exports.panelButtons.length; i++) {
        if (i % 5 === 0)
            actionsRows.push(new discord_js_1.ActionRowBuilder());
        actionsRows[actionsRows.length - 1].addComponents(exports.panelButtons[i]);
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
class Index {
    /**
     * The client of the service.
     */
    client;
    /**
     * The guild where the admin panel is sent.
     */
    guild;
    /**
     * The message where the admin panel is sent.
     */
    message;
    /**
     * The context of the admin panel.
     */
    ctx;
    /**
     * @param client The client.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Resend/edit the panel to update information.
     * @returns Nothing.
     */
    async refreshChannel() {
        const messages = await this.ctx.channel.messages.fetch().catch(Util_1.caught);
        if (!messages)
            return;
        const payload = {
            content: 'Testing panel',
            components: generatePanelRows(),
        };
        if (!messages.first())
            await this.ctx.send(payload);
        else
            await this.ctx.edit(payload, messages.first(), false);
    }
}
exports.Index = Index;
/**
 * The channel of the context.
 * @param client The client.
 * @param channel The channel of the context.
 * @param guild The guild of the context.
 * @returns Nothing.
 */
async function index(client, channel, guild) {
    const indexInstance = new Index(client);
    indexInstance.ctx = new Context_1.default(await (0, Util_1.SFToCtxChannel)(client, guild, channel), null, null, client.user);
    indexInstance.guild = (await client.guilds.fetch(guild).catch(Util_1.caught)) || null;
    return indexInstance;
}
exports.default = index;
