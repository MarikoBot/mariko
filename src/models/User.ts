import { Schema, model, Types } from 'mongoose';
import { Language } from '../service/game/Typings';
import { Snowflake } from 'discord.js';

/**
 * The type for a subscription.
 */
export interface Subscription {
  /**
   * The price paid in dollars.
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
  /**
   * The servers boosted with premium.
   */
  servers: [];
  /**
   * If the user gets premium on the RPG.
   */
  rpg: boolean;
  /**
   * If the user gets premium on the utils.
   */
  global: boolean;
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
}

/**
 * The mongo schema for the interface.
 */
export const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  discordId: { type: String, required: true },
  language: { type: String, required: true },
  subscriptions: { type: Object, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('User', schema);

/**
 * The default data.
 */
export const { id, ...defaultData }: Interface = {
  id: null,
  discordId: '539842701592494111',
  language: 'fr',
  subscriptions: {},
};

/**
 * The primary key of the table.
 */
export const PRIMARY_KEY: string = 'discordId' as const;
