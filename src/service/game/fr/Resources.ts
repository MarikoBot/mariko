// noinspection JSUnusedGlobalSymbols

import { Skill, Way, Weapon } from '../Typings';

/**
 * The name of each way.
 */
export const wayNames: Record<Way, string> = {
  /**
   * The warrior name.
   */
  warrior: 'Guerrier',
  /**
   * The strategist name.
   */
  strategist: 'Stratège',
  /**
   * The agile name.
   */
  agile: 'Agile',
  /**
   * The goliath name.
   */
  goliath: 'Goliath',
  /**
   * The ninja name.
   */
  ninja: 'Ninja',
};

/**
 * The description of each way.
 */
export const wayDescriptions: Record<Way, string> = {
  /**
   * The warrior description.
   */
  warrior:
    'Cette Voie possède des facultés polyvalentes avec un point fort dans la force physique. ' +
    'Elle est également avantageuse pour une grande durabilité en combat. ' +
    'Toutefois, ses points faibles restent la vitesse et la récupération.',
  /**
   * The strategist description.
   */
  strategist:
    "Cette Voie possède des capacités très développées dans la synergie, ainsi qu'une bonne force mentale. " +
    "Cependant, ses points faibles résident dans la vitesse et l'encaissement.",
  /**
   * The agile description.
   */
  agile:
    'Cette Voie possède des atouts hors du commun en endurance, mais également en vitesse. ' +
    'Néanmoins, ses points faibles sont la force physique et la récupération.',
  /**
   * The goliath description.
   */
  goliath:
    "Cette Voie possède un avantages incontestable en encaissement ainsi qu'une force physique sur-développée. " +
    'Malgré cela, le Goliath possède une mauvaise synergie et une endurance moindre.',
  /**
   * The ninja description.
   */
  ninja:
    'Cette Voie possède une vitesse divine et une synergie très avantageuse.' +
    'Or, le Ninja possède une force physique et un encaissement très faible.',
};

/**
 * The name of each skill.
 */
export const skillNames: Record<Skill, string> = {
  /**
   * The strength name.
   */
  strength: 'Force Physique',
  /**
   * The durability name.
   */
  durability: 'Durabilité',
  /**
   * The endurance name.
   */
  endurance: 'Endurance',
  /**
   * The speed name.
   */
  speed: 'Vitesse',
  /**
   * The collection name.
   */
  collection: 'Encaissement',
  /**
   * The recovery name.
   */
  recovery: 'Récupération',
  /**
   * The synergy name.
   */
  synergy: 'Synergie',
  /**
   * The mental name.
   */
  mental: 'Force Mentale',
};

/**
 * The name of each weapon.
 */
export const weaponNames: Record<Weapon, string> = {
  katana: 'Katana',
  poisonedKatana: 'Katana Empoisonné',
  flailWithAxe: 'Fléau avec Hache',
  undulatingKatana: 'Katana Ondulant',
  whippingKatana: 'Katana Fouettant',
  twinBlades: 'Lames Jumelles',
  laceratingKatanas: 'Katanas Lacérants',
  fleshyShotgun: 'Fusil de Chair',
};
