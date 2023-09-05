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
  /**
   * The id of the art.
   */
  id: string;
  /**
   * The name of the art.
   */
  name: string;
  /**
   * The moves of the art.
   */
  moves: string[];
  /**
   * The different moves sorted in each category.
   */
  movesCategories: {
    /**
     * Basic attacks.
     */
    basic: number[];
    /**
     * Attacks in fineness.
     */
    fineness: number[];
    /**
     * Heavy attacks.
     */
    heavy: number[];
    /**
     * Ultimate attacks.
     */
    ultimate: number[];
  };
  /**
   * If it's a custom art.
   */
  custom?: boolean;
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
export type Language = 'fr' | 'en';
