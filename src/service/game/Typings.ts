/**
 * The id of the breathing style.
 */
export type BreathingStyle =
  | 'beast'
  | 'flame'
  | 'flower'
  | 'insect'
  | 'love'
  | 'mist'
  | 'moon'
  | 'serpent'
  | 'sound'
  | 'stone'
  | 'sun'
  | 'thunder'
  | 'water'
  | 'wind';

/**
 * The id of the blood demon art.
 */
export type BloodDemonArt =
  | 'explodingBlood'
  | 'hiasobiTemari'
  | 'koketsuArrow'
  | 'threadManipulation'
  | 'sleepInducement'
  | 'obiSashManipulation'
  | 'bloodManipulation'
  | 'destructiveDeath'
  | 'cryokinesis'
  | 'crescentMoonBlades';

/**
 * The id of the way.
 */
export type Way = 'warrior' | 'strategist' | 'agile' | 'goliath' | 'ninja';

/**
 * The id of the race.
 */
export type Race = 'demon' | 'human';

/**
 * The id of the skill.
 */
export type Skill =
  | 'strength'
  | 'durability'
  | 'endurance'
  | 'speed'
  | 'collection'
  | 'recovery'
  | 'synergy'
  | 'mental';

/**
 * The representation of an art.
 */
export type Art = {
  id: string;
  name: string;
  moves: string[];
  movesCategories: {
    basic: number[];
    fineness: number[];
    heavy: number[];
    ultimate: number[];
  };
  custom?: true;
};

/**
 * The ID of a weapon.
 */
export type Weapon =
  | 'katana'
  | 'poisonedKatana'
  | 'flailWithAxe'
  | 'undulatingKatana'
  | 'whippingKatana'
  | 'twinBlades'
  | 'laceratingKatanas'
  | 'fleshyShotgun';

/**
 * The ID of food.
 */
export type Food = 'onigiri';

/**
 * The ID of an item.
 */
export type Item = 'egg';

/**
 * The ID of a tool.
 */
export type Tool = 'pickaxe';

/**
 * The ID of a language.
 */
export type Language = 'fr';
