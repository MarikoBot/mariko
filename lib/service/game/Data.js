"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wayEmojis = exports.waySkills = exports.weaponsAddedValues = void 0;
/**
 * The weapons added values of the game.
 */
exports.weaponsAddedValues = {
    katana: ['durability', 'synergy'],
    poisonedKatana: ['synergy', 'strength'],
    flailWithAxe: ['strength', 'speed'],
    undulatingKatana: ['speed', 'strength'],
    whippingKatana: ['synergy', 'durability'],
    twinBlades: ['speed', 'collection'],
    laceratingKatanas: ['strength', 'speed'],
    fleshyShotgun: ['speed', 'collection'],
};
/**
 * The main skill, bonus and malus of each way.
 */
exports.waySkills = {
    warrior: ['strength', 'durability', 'speed', 'recovery'],
    strategist: ['synergy', 'mental', 'speed', 'collection'],
    agile: ['endurance', 'speed', 'strength', 'recovery'],
    goliath: ['collection', 'strength', 'synergy', 'endurance'],
    ninja: ['speed', 'synergy', 'strength', 'durability'],
};
/**
 * The emoji of each way.
 */
exports.wayEmojis = {
    warrior: '👺',
    strategist: '🧪',
    agile: '🔪',
    goliath: '🪓',
    ninja: '🥷',
};
