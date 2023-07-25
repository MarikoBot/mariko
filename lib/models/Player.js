"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mongoose_1 = require("mongoose");
/**
 * The mongo schema for the interface.
 */
const schema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'id' },
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    experience: { type: Number, required: true },
    race: { type: String, required: true },
    art: { type: String, required: true },
    way: { type: String, required: true },
    wallet: { type: Number, required: true },
    techniqueCategoryLevels: {
        basic: { type: Number, required: true },
        fineness: { type: Number, required: true },
        heavy: { type: Number, required: true },
        ultimate: { type: Number, required: true },
    },
    pv: {
        current: { type: Number, required: true },
        lastGain: { type: Number, required: true }
    },
    power: {
        current: { type: Number, required: true },
        lastGain: { type: Number, required: true }
    },
    weapon: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        durability: { type: Number, required: true },
    },
    food: { type: Object, required: true },
    tools: { type: Object, required: true },
    weapons: { type: Object, required: true },
    activities: {
        forgedAt: { type: Number, required: true },
        forgedTime: { type: Number, required: true },
        fishedAt: { type: Number, required: true },
        dugAt: { type: Number, required: true },
    }
});
/**
 * The generated model for the schema.
 */
exports.Model = (0, mongoose_1.model)('Player', schema);
