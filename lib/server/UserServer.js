"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
const Util_1 = require("../root/Util");
/**
 * The user server.
 */
class UserServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.User);
    }
    /**
     * Create a new user.
     * @param discordId The discord id.
     * @param language The language id.
     * @returns Nothing.
     */
    async createUser(discordId, language) {
        await this.create({
            discordId,
            language,
            date: Date.now(),
        });
    }
    /**
     * Extract the language id from a user.
     * @param discordId The user ID.
     * @returns The user id. Returns "en" if not found.
     */
    async getLanguage(discordId) {
        const data = await this.find({ discordId });
        if (!data || !('language' in data))
            return 'en';
        return data.language;
    }
    /**
     * Get the list of all subscriptions from the server.
     * @returns The subscriptions data.
     */
    async getSubsData() {
        const data = await this.collectionData.Model.find().exec();
        const subList = data
            .filter((e) => e?.subscriptions)
            .map((e) => e?.subscriptions);
        const subData = {
            totalIncomes: subList.map((e) => e.price),
            subscribers: {},
            subscriptions: subList,
        };
        for (const user of data) {
            subData.subscribers[user.discordId] = {
                user: (await this.client.users.fetch(user.discordId).catch(Util_1.clean)) || { id: user.discordId },
                sub: user.subscription,
            };
        }
        return subData;
    }
}
exports.default = UserServer;
