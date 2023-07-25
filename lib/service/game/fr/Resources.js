"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaponNames = exports.skillNames = exports.wayDescriptions = exports.wayNames = void 0;
/**
 * The name of each way.
 */
exports.wayNames = {
    warrior: 'Guerrier',
    strategist: 'Stratège',
    agile: 'Agile',
    goliath: 'Goliath',
    ninja: 'Ninja',
};
/**
 * The description of each way.
 */
exports.wayDescriptions = {
    warrior: 'Cette Voie possède des facultés polyvalentes avec un point fort dans la force physique. ' +
        'Elle est également avantageuse pour une grande durabilité en combat. ' +
        'Toutefois, ses points faibles restent la vitesse et la récupération.',
    strategist: "Cette Voie possède des capacités très développées dans la synergie, ainsi qu'une bonne force mentale. " +
        "Cependant, ses points faibles résident dans la vitesse et l'encaissement.",
    agile: 'Cette Voie possède des atouts hors du commun en endurance, mais également en vitesse. ' +
        'Néanmoins, ses points faibles sont la force physique et la récupération.',
    goliath: "Cette Voie possède un avantages incontestable en encaissement ainsi qu'une force physique sur-développée. " +
        'Malgré cela, le Goliath possède une mauvaise synergie et une endurance moindre.',
    ninja: 'Cette Voie possède une vitesse divine et une synergie très avantageuse.' +
        'Or, le Ninja possède une force physique et un encaissement très faible.',
};
/**
 * The name of each skill.
 */
exports.skillNames = {
    strength: 'Force Physique',
    durability: 'Durabilité',
    endurance: 'Endurance',
    speed: 'Vitesse',
    collection: 'Encaissement',
    recovery: 'Récupération',
    synergy: 'Synergie',
    mental: 'Force Mentale',
};
/**
 * The name of each weapon.
 */
exports.weaponNames = {
    katana: 'Katana',
    poisonedKatana: 'Katana Empoisonné',
    flailWithAxe: 'Fléau avec Hache',
    undulatingKatana: 'Katana Ondulant',
    whippingKatana: 'Katana Fouettant',
    twinBlades: 'Lames Jumelles',
    laceratingKatanas: 'Katanas Lacérants',
    fleshyShotgun: 'Fusil de Chair',
};
