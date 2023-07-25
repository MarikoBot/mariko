import { Schema, model, Types } from 'mongoose';
import { Language } from '../service/game/Typings';
import { Snowflake } from 'discord.js';

/**
 * The type for a subscription.
 */
export interface Subscription {
  /**
   * The price in euros.
   */
  price: number;
  /**
   * The discord ID of the subscription.
   */
  discordId: Snowflake;
  /**
   * The date of the subscription.
   */
  date: Date;
  /**
   * Information about the subscription.
   */
  id: string;
}

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The user mongoose ID.
   */
  id: Types.ObjectId;
  /**
   * The user defined language.
   */
  language: Language;
  /**
   * The Discord ID of the user.
   */
  discordId: string;
  /**
   * List of subscriptions linked to the user.
   */
  subscriptions: Record<string, Subscription>;
  /**
   * If the user is premium on the RPG.
   */
  rpgPremium: boolean;
  /**
   * If the user is premium on the other service.
   */
  globalPremium: boolean;
}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  discordId: { type: String, required: true },
  language: { type: String, required: true },
  subscriptions: { type: Object, required: true },
  rpgPremium: { type: Boolean, required: true },
  globalPremium: { type: Boolean, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('User', schema);
