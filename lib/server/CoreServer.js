"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
const ClientConfig_1 = require("../res/ClientConfig");
/**
 * The core server.
 */
class CoreServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Core.Model);
    }
    /**
     * Get the core from the database.
     * @param clientId The player id.
     * @returns The player.
     */
    async find(clientId = ClientConfig_1.default.defaultClientId) {
        return await this.mongooseModel.findOne({ clientId }).exec();
    }
    /**
     * Create a new core instance.
     * @param clientId The player id.
     * @returns The created player.
     */
    async create(clientId = ClientConfig_1.default.defaultClientId) {
        const entry = new this.mongooseModel({ clientId });
        await entry.save();
    }
}
exports.default = CoreServer;
