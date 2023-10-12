"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const Blacklisting_1 = require("./Blacklisting");
const Monitoring_1 = require("./Monitoring");
const CommandsPrivilegesSetting_1 = require("./CommandsPrivilegesSetting");
const Context_1 = require("../../root/Context");
const Util_1 = require("../../root/Util");
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
     * Generate a command privileges setting panel.
     */
    get commandPrivilegesSetting() {
        return new CommandsPrivilegesSetting_1.default(this.client, this.ctx);
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
 * @param channel The channel of the context.
 * @param guild The guild of the context.
 * @returns An index instance.
 */
async function index(client, channel, guild) {
    const indexInstance = new Index(client);
    indexInstance.ctx = new Context_1.default(await (0, Util_1.IdToCtxChannel)(client, guild, channel), null, null, client.user);
    return indexInstance;
}
exports.default = index;
