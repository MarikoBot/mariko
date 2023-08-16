"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultData = exports.id = exports.Model = exports.schema = void 0;
const mongoose_1 = require("mongoose");
const Resources_1 = require("../service/game/fr/Resources");
/**
 * The mongo schema for the interface.
 */
exports.schema = new mongoose_1.Schema({
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
        lastGain: { type: Number, required: true },
    },
    power: {
        current: { type: Number, required: true },
        lastGain: { type: Number, required: true },
    },
    weapon: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        durability: { type: Number, required: true },
    },
    food: { type: Object, required: true },
    tools: { type: Object, required: true },
    weapons: { type: Object, required: true },
    location: {
        region: { type: String, required: true },
        traveledFrom: { type: String, required: true },
        traveledTo: { type: String, required: true },
        traveledAt: { type: Number, required: true },
    },
    activities: {
        forgedAt: { type: Number, required: true },
        forgedTime: { type: Number, required: true },
        fishedAt: { type: Number, required: true },
        dugAt: { type: Number, required: true },
    },
});
/**
 * The generated model for the schema.
 */
exports.Model = (0, mongoose_1.model)('Player', exports.schema);
/**
 * The default data.
 */
_a = {
    id: null,
    discordId: '1113174518744236034',
    username: 'Tanaka Ken',
    experience: 0,
    race: 'human',
    art: 'water',
    way: 'warrior',
    wallet: 0,
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
        forgedAt: 0,
        forgedTime: 0,
        fishedAt: 0,
        dugAt: 0,
    },
}, exports.id = _a.id, exports.defaultData = __rest(_a, ["id"]);
