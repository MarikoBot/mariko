import { Schema, model, Types } from 'mongoose';
import { Snowflake } from 'discord.js';

/**
 * List of privileges for a command.
 */
export interface CommandPrivileges {
  /**
   * If the command is forbidden in some specific channels.
   */
  forbiddenChannels?: string[];
  /**
   * If the command is forbidden for some specific users.
   */
  forbiddenUsers?: string[];
  /**
   * If the command is forbidden for some specific roles.
   */
  forbiddenRoles?: string[];
  /**
   * If the command is forbidden for some specific guilds.
   */
  forbiddenGuilds?: string[];
  /**
   * If the command is only allowed in some specific channels only.
   */
  uniqueChannels?: string[];
  /**
   * If the command is only allowed by some specific users only.
   */
  uniqueUsers?: string[];
  /**
   * If the command is only allowed by some specific roles only.
   */
  uniqueRoles?: string[];
  /**
   * If the command is only allowed in some specific guilds only.
   */
  uniqueGuilds?: string[];
}

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
  /**
   * The list of blacklisted users. Prevent them from using any command.
   */
  blacklist: Record<Snowflake, { userId: Snowflake; info: string; commands: 'all' | string[] }>;
  /**
   * The list of restrictions and privileges for specified commands.
   */
  commandPrivileges: Record<string, CommandPrivileges>;
}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  clientId: { type: String, required: true },
  blacklist: { type: Object, required: true },
  commandPrivileges: { type: Object, required: true },
});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('Core', schema);

/**
 * The default data.
 */
export const { id, ...defaultData }: Interface = {
  id: null,
  clientId: '1113174518744236034',
  blacklist: {
    '751206188791627877': {
      userId: '751206188791627877',
      info: 'total',
      commands: 'all',
    },
  },
  commandPrivileges: {},
};
