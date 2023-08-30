import { Schema, model, Types } from 'mongoose';

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
   * If the guild is premium on the guild service.
   */
  guildPremium: boolean;
}

/**
 * The mongo schema for the interface.
 */
export const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  discordId: { type: String, required: true },
  guildPremium: { type: Boolean, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('Guild', schema);

/**
 * The default data.
 */
export const { id, ...defaultData }: Interface = {
  id: null,
  discordId: '539842701592494111',
  guildPremium: false,
};

/**
 * The primary key of the table.
 */
export const PRIMARY_KEY: string = 'discordId' as const;
