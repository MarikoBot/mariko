"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
/**
 * The user server.
 */
class UserServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.User.Model);
    }
    /**
     * Get a user from the database.
     * @param discordId The discord id.
     * @returns The user.
     */
    async find(discordId) {
        return await this.mongooseModel.findOne({ discordId }).exec();
    }
    /**
     * Create a new user.
     * @param discordId The discord id.
     * @param language The language id.
     * @returns The created user.
     */
    async create(discordId, language) {
        const entry = new this.mongooseModel({
            discordId,
            language,
            subscriptions: {},
            rpgPremium: false,
            globalPremium: false,
        });
        await entry.save();
    }
    /**
     * Extract the language id from a user.
     * @param discordId The user ID.
     * @returns The user id. Returns 'fr' if not found.
     */
    async getLanguage(discordId) {
        const data = await this.find(discordId);
        if (!data || !('language' in data))
            return 'fr';
        return data.language;
    }
}
exports.default = UserServer;
