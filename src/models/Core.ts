import { Schema, model, Types } from 'mongoose';
import { Snowflake } from 'discord.js';

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The mongoose ID.
   */
  id: Types.ObjectId;
  /**
   * The Discord Client ID.
   */
  clientId: Snowflake;
}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  clientId: { type: String, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('Core', schema);
