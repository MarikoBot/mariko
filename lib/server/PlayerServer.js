"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models = require("../models");
const BaseServer_1 = require("./BaseServer");
const Resources_1 = require("../service/game/fr/Resources");
/**
 * The player server.
 */
class PlayerServer extends BaseServer_1.default {
    /**
     * @param client The client instance.
     */
    constructor(client) {
        super(client, models.Player.Model);
    }
    /**
     * Get a player from the database.
     * @param discordId The player id.
     * @returns The player.
     */
    async find(discordId) {
        return await this.mongooseModel.findOne({ discordId }).exec();
    }
    /**
     * Create a new player.
     * @param discordId The player id.
     * @param username The player username.
     * @param race The player race.
     * @param art The player art.
     * @param way The player way.
     * @returns The created player.
     */
    async create(discordId, username = 'Tanaka Ken', race = 'human', art = 'water', way = 'warrior') {
        const entry = new this.mongooseModel({
            discordId,
            username,
            experience: 0,
            race,
            art,
            way,
            pv: {
                current: 100,
                lastGain: 0,
            },
            power: {
                current: 100,
                lastGain: 0,
            },
            techniqueCategoryLevels: {
                basic: 1,
                fineness: 1,
                heavy: 1,
                ultimate: 1,
            },
            weapon: {
                id: 'katana',
                name: Resources_1.weaponNames.katana,
                durability: 100,
            },
            food: {},
            tools: {},
            weapons: {},
            location: {
                region: 'mount_sagiri',
                traveledFrom: null,
                traveledTo: 'mount_sagiri',
                traveledAt: 0,
            },
            activities: {
                /**
                 * When the last forge started.
                 */
                forgedAt: 0,
                /**
                 * The number of hours to spend forging.
                 */
                forgedTime: 0,
                /**
                 * When the last fishing rod was launched.
                 */
                fishedAt: 0,
                /**
                 * When the last dig was done.
                 */
                dugAt: 0,
            },
        });
        await entry.save();
    }
}
exports.default = PlayerServer;
