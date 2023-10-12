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
     * The constructor of the core server.
     *
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Core);
    }
    /**
     * Get the command privileges for a specified command in an external loading purpose.
     *
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
     *
     * @returns Nothing.
     */
    async createCore() {
        return await this.create({ clientId: ClientConfig_1.default.defaultClientId });
    }
    /**
     * Get the core data.
     *
     * @returns The core data.
     */
    async getCore() {
        return await this.find({ clientId: ClientConfig_1.default.defaultClientId });
    }
    /**
     * Update the core.
     *
     * @param data The data to update.
     * @returns The core data.
     */
    async updateCore(data) {
        return await this.update({ clientId: ClientConfig_1.default.defaultClientId }, data);
    }
    /**
     * Get the blacklist.
     *
     * @returns The blacklist.
     */
    async getBlacklist() {
        const data = (await this.find({
            clientId: ClientConfig_1.default.defaultClientId,
        }));
        /* for (let i = 0; i < 0; i-=-1) {
          data.blacklist[String(i)] = {
            id: String(i),
            info: `testing ${i}`,
            type: 'guild',
            commands: 'all',
            date: Date.now(),
          };
        }*/
        return Object.values(data.blacklist);
    }
    /**
     * Add an element to the blacklist.
     *
     * @param element The fields of the element to add.
     * @returns Nothing.
     */
    async blacklistElement(element) {
        const idValue = element.data.get('id').value;
        const typeValue = element.data.get('type').value;
        const infoValue = element.data.get('info').value;
        const commandsValue = element.data.get('commands').value;
        const blacklistData = {
            id: idValue,
            type: typeValue,
            info: infoValue,
            commands: commandsValue === 'all' ? commandsValue : commandsValue.split(', '),
            date: Date.now(),
        };
        const blacklist = (await this.find({
            clientId: ClientConfig_1.default.defaultClientId,
        })).blacklist;
        blacklist[idValue] = blacklistData;
        await this.updateCore({ blacklist });
    }
    /**
     * Remove an element from the blacklist.
     *
     * @param elementPos The element position on the panel. Not the element id.
     * @returns Nothing.
     */
    async unblacklistElement(elementPos) {
        const blacklistArray = await this.getBlacklist();
        const blacklistData = (await this.find({
            clientId: ClientConfig_1.default.defaultClientId,
        })).blacklist;
        if (Number(elementPos) > blacklistArray.length)
            return;
        const element = blacklistArray[Number(elementPos)];
        delete blacklistData[element.id];
        await this.updateCore({ blacklist: blacklistData });
    }
    /**
     * Function that edits command privileges and update it on the database.
     * @param data The fields of the form to edit.
     * @returns Nothing.
     */
    async editCommandPrivileges(data) {
        // CODE
    }
    /**
     * Get the commands list with each privilege.
     *
     * @returns The list.
     */
    async getCommandsPrivilegesList() {
        const data = (await this.find({
            clientId: ClientConfig_1.default.defaultClientId,
        }));
        return data.commandPrivileges;
    }
}
exports.default = CoreServer;
