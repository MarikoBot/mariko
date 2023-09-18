"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_1 = require("../res/ClientConfig");
const Util_1 = require("./Util");
/**
 * The main class that includes some functions for the support linked features.
 */
class SupportGuild {
    /**
     * The client instance.
     */
    client;
    /**
     * The linked support guild id.
     */
    guildId = ClientConfig_1.default.supportGuildId;
    /**
     * The linked support guild.
     */
    guild;
    /**
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Refreshes the linked guild data.
     */
    async refreshSupport() {
        this.guild = await (0, Util_1.IdToGuild)(this.client, this.guildId);
    }
    /**
     * Get the list of members for each role.
     * @returns Nothing.
     */
    get membersByRole() {
        const record = {};
        if (!this.guild)
            return;
        for (const [_, roleId] of Object.entries(ClientConfig_1.default.supportRoles))
            record[roleId] = this.guild.roles.cache.get(roleId).members.map((m) => m);
        return record;
    }
    /**
     * Compares two persons by their id and returns a boolean that designate if
     * the first one is stronger than the second one.
     * @param sourceId The first member id.
     * @param targetId The second member id.
     * @returns The boolean that designate if the first member take the priority on the second one.
     */
    async takesPriority(sourceId, targetId) {
        const [source, target] = [
            this.guild.members.cache.get(sourceId),
            this.guild.members.cache.get(targetId),
        ];
        const membersByRole = this.membersByRole;
        let [i, j] = [-1, -1];
        for (let k = 0; k < Object.keys(membersByRole).length; k++) {
            const roleContent = Object.entries(membersByRole)[k][1];
            if (source.id in roleContent)
                i = k;
            if (target.id in roleContent)
                j = k;
        }
        return i > j;
    }
}
exports.default = SupportGuild;
