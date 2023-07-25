import { Schema, model, Types } from 'mongoose';
import { Subscription } from './User';

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The guild mongoose ID.
   */
  id: Types.ObjectId;
  /**
   * The Discord ID of the guild.
   */
  discordId: string;
  /**
   * List of subscriptions linked to the guild.
   */
  subscriptions: Record<string, Subscription>;
  /**
   * If the guild is premium on the guild service.
   */
  guildPremium: boolean;
}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  discordId: { type: String, required: true },
  subscriptions: { type: Object, required: true },
  guildPremium: { type: Boolean, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('Guild', schema);
