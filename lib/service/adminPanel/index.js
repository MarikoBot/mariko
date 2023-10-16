"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = exports.generatePanelRows = exports.emptyButton = void 0;
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("../../root/Util");
const Blacklisting_1 = require("./Blacklisting");
const Monitoring_1 = require("./Monitoring");
const Context_1 = require("../../root/Context");
/**
 * An empty button for the panel.
 *
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
const emptyButton = (id) => new discord_js_1.ButtonBuilder().setStyle(v10_1.ButtonStyle['Secondary']).setDisabled(true).setCustomId(id).setEmoji('▪️');
exports.emptyButton = emptyButton;
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
class Index {
    /**
     * Client instance.
     */
    client;
    /**
     * The context of the action.
     */
    ctx;
    /**
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Generate a blacklisting panel.
     */
    get blacklisting() {
        return new Blacklisting_1.default(this.client, this.ctx);
    }
    /**
     * Generate a monitoring panel.
     */
    get monitoring() {
        return new Monitoring_1.Monitoring(this.client, this.ctx);
    }
}
exports.Index = Index;
/**
 * The channel of the context.
 *
 * @param client The client.
 * @param guildId The channel of the context.
 * @param channelId The guild of the context.
 * @returns An index instance.
 */
async function index(client, guildId, channelId) {
    const indexInstance = new Index(client);
    indexInstance.ctx = new Context_1.default(await (0, Util_1.IdToCtxChannel)(client, guildId, channelId), null, null, client.user);
    return indexInstance;
}
exports.default = index;
