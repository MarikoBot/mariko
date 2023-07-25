import { Schema, model, Types } from 'mongoose';
import { BloodDemonArt, BreathingStyle, Food, Language, Race, Tool, Way, Weapon } from '../service/game/Typings';

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The player mongoose ID.
   */
  id: Types.ObjectId;
  /**
   * The Discord ID of the user.
   */
  discordId: string;
  /**
   * The username of the player.
   */
  username: string;
  /**
   * The experience of the player.
   */
  experience: number;
  /**
   * The race of the user (Demon, Human).
   */
  race: Race;
  /**
   * The art of the player. It could be a breathing style or a blood demon art.
   */
  art: BreathingStyle | BloodDemonArt;
  /**
   * The way of the player.
   */
  way: Way;
  /**
   * The wallet of the user
   */
  wallet: number;
  /**
   * Level of each technique category
   */
  techniqueCategoryLevels: {
    /**
     * The level of the base attack.
     */
    basic: number;
    /**
     * The level of the fineness attack.
     */
    fineness: number;
    /**
     * The level of the heavy attack.
     */
    heavy: number;
    /**
     * The level of the ultimate attack.
     */
    ultimate: number;
  };
  /**
   * The health points.
   */
  pv: {
    /**
     * The current health points of the player.
     */
    current: number;
    /**
     * The timestamp when the player received his last heal.
     */
    lastGain: number;
  };
  /**
   * The power if the player is a demon.
   */
  power:
    | {
        /**
         * The current health points of the player.
         */
        current: number;
        /**
         * The timestamp when the player received his last heal.
         */
        lastGain: number;
      }
    | 'notDemon';
  /**
   * The weapon data.
   */
  weapon: {
    /**
     * The weapon ID. If the weapon is customised, the ID written is the one associated with the added values
     * of the weapon.
     */
    id: Weapon;
    /**
     * The name of the weapon.
     */
    name: string;
    /**
     * The durability of the weapon.
     */
    durability: number;
  };
  /**
   * If the user is a human, it cans have some food.
   */
  food: Record<Food, number> | 'notHuman';
  /**
   * Tools of the player.
   */
  tools: Record<Tool, number>;
  /**
   * The stock of weapons of the player.
   */
  weapons: Record<Weapon, number>;
  /**
   * The list of cool downs and activities.
   */
  activities: {
    /**
     * When the last forge started.
     */
    forgedAt: number;
    /**
     * The number of hours to spend forging.
     */
    forgedTime: number;
    /**
     * When the last fishing rod was launched.
     */
    fishedAt: number;
    /**
     * When the last dig was done.
     */
    dugAt: number;
  };
}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
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
export const Model = model<Interface>('Player', schema);
