"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
/**
 * The salesperson server.
 */
class SalespersonServer extends BaseServer_1.default {
    /**
     * The constructor of the salesperson server.
     *
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Salesperson);
    }
    /**
     * Create a new player.
     *
     * @param discordId The player id.
     * @param guildId The guild id.
     * @returns Nothing.
     */
    async createSalesperson(discordId, guildId) {
        await this.create({
            discordId,
            guildId,
        });
    }
}
exports.default = SalespersonServer;
