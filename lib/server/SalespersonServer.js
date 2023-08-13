"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
/**
 * The player server.
 */
class SalespersonServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Salesperson);
    }
    /**
     * Create a new player.
     * @param discordId The player id.
     * @param guildId The guild id.
     * @returns The created salesperson.
     */
    async createSalesperson(discordId, guildId) {
        await this.create({
            discordId,
            guildId,
        });
    }
}
exports.default = SalespersonServer;
