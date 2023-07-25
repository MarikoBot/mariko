"use strict";
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
        super(client, models.User.Model);
    }
    /**
     * Get a guild from the database.
     * @param discordId The discord id.
     * @returns The guild.
     */
    async find(discordId) {
        return await this.mongooseModel.findOne({ discordId }).exec();
    }
    /**
     * Create a new guild.
     * @param discordId The discord id.
     * @returns The created guild.
     */
    async create(discordId) {
        const entry = new this.mongooseModel({
            discordId,
            subscriptions: {},
            guildPremium: false,
        });
        await entry.save();
    }
}
exports.default = GuildServer;
