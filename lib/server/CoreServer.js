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
        super(client, models.Core);
    }
    /**
     * Get the command privileges for a specified command in an external loading purpose.
     * @param commandName The command name.
     * @returns The external data.
     */
    async getExternalPrivileges(commandName) {
        const data = (await this.find({
            clientId: ClientConfig_1.default.defaultClientId,
        }));
        return data.commandPrivileges?.[commandName] || {};
    }
    /**
     * Create a new core.
     * @returns Nothing.
     */
    async createCore() {
        return await this.create({ clientId: ClientConfig_1.default.defaultClientId });
    }
    /**
     * Get the core data.
     * @returns The core data.
     */
    async getCore() {
        return await this.find({ clientId: ClientConfig_1.default.defaultClientId });
    }
    /**
     * Update the core.
     * @param data The data to update.
     * @returns The core data.
     */
    async updateCore(data) {
        return await this.update({ clientId: ClientConfig_1.default.defaultClientId }, data);
    }
}
exports.default = CoreServer;
