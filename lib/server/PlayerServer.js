"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
/**
 * The player server.
 */
class PlayerServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Player);
    }
    /**
     * Create a new player.
     * @param discordId The player id.
     * @param username The player username.
     * @param race The player race.
     * @param art The player art.
     * @param way The player way.
     * @returns Nothing.
     */
    async createPlayer(discordId, username = 'Tanaka Ken', race = 'human', art = 'water', way = 'warrior') {
        await this.create({
            discordId,
            username,
            race,
            art,
            way,
        });
    }
}
exports.default = PlayerServer;
