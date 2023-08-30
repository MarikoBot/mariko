"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
/**
 * The guild server.
 */
class GuildServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Guild);
    }
    /**
     * Create a new guild.
     * @param discordId The guild id.
     * @returns Nothing.
     */
    async createPlayer(discordId) {
        await this.create({
            discordId,
        });
    }
}
exports.default = GuildServer;
