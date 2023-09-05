"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wayEmojis = exports.waySkills = exports.weaponsAddedValues = void 0;
/**
 * The weapons added values of the game.
 */
exports.weaponsAddedValues = {
    /**
     * A basic katana.
     */
    katana: ['durability', 'synergy'],
    /**
     * A poisoned katana. Shinobu's katana for example.
     */
    poisonedKatana: ['synergy', 'strength'],
    /**
     * A flail with an axe linked with a chain between. Gyomei's weapon for example.
     */
    flailWithAxe: ['strength', 'speed'],
    /**
     * A katana that can move making undulations. Obanai's katana for example.
     */
    undulatingKatana: ['speed', 'strength'],
    /**
     * A katana that can take the shape of a whip. Mitsuri's katana for example.
     */
    whippingKatana: ['synergy', 'durability'],
    /**
     * Two blades linked by a chain. Tengen's katana for example.
     */
    twinBlades: ['speed', 'collection'],
    /**
     * Two katanas with a lacerating blade. Inosuke's katana for example.
     */
    laceratingKatanas: ['strength', 'speed'],
    /**
     * A shotgun that throws special bullets. Genya's weapon for example.
     */
    fleshyShotgun: ['speed', 'collection'],
};
/**
 * The main skill, bonus and malus of each way.
 */
exports.waySkills = {
    /**
     * The warrior way. Tanjiro like.
     */
    warrior: ['strength', 'durability', 'speed', 'recovery'],
    /**
     * The strategist way. Shinobu like.
     */
    strategist: ['synergy', 'mental', 'speed', 'collection'],
    /**
     * The agile way. Mitsuri or Obanai like.
     */
    agile: ['endurance', 'speed', 'strength', 'recovery'],
    /**
     * The goliath way. Gyomei like.
     */
    goliath: ['collection', 'strength', 'synergy', 'endurance'],
    /**
     * The ninja way. Tengen like.
     */
    ninja: ['speed', 'synergy', 'strength', 'durability'],
};
/**
 * The emoji of each way.
 */
exports.wayEmojis = {
    /**
     * The warrior emoji.
     */
    warrior: '👺',
    /**
     * The strategist emoji.
     */
    strategist: '🧪',
    /**
     * The agile emoji.
     */
    agile: '🔪',
    /**
     * The goliath emoji.
     */
    goliath: '🪓',
    /**
     * The ninja emoji.
     */
    ninja: '🥷',
};
