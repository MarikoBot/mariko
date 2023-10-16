import { Schema, model, Types } from 'mongoose';
import { Snowflake } from 'discord.js';

/**
 * Represents a blacklisted user/guild.
 */
export interface BlacklistData {
  /**
   * The id of the guild or the user.
   */
  id: Snowflake;
  /**
   * The info of the blacklist. Additional information.
   */
  info: string;
  /**
   * Type, if it's a user or a guild.
   */
  type: 'guild' | 'user';
  /**
   * Commands that are blacklisted.
   */
  commands: 'all' | string[];
  /**
   * The date when the element got blacklisted.
   */
  date: number;
}

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
 * The list of commands privileges keys.
 */
export const commandPrivilegesKeys: (keyof CommandPrivileges)[] = [
  'forbiddenChannels',
  'forbiddenGuilds',
  'forbiddenRoles',
  'forbiddenUsers',
  'uniqueChannels',
  'uniqueGuilds',
  'uniqueRoles',
  'uniqueUsers',
];

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The mongoose id.
   */
  id: Types.ObjectId;
  /**
   * The Discord Client id.
   */
  clientId: Snowflake;
  /**
   * The list of blacklisted users/guilds. Prevent them from using any command.
   */
  blacklist: Record<Snowflake, BlacklistData>;
  /**
   * The list of restrictions and privileges for specified commands.
   */
  commandPrivileges: Record<string, CommandPrivileges>;
  /**
   * The bot status.
   */
  status: 'online' | 'maintenance' | 'offline';
}

/**
 * The mongo schema for the interface.
 */
export const schema = new Schema<Interface>({
  id: { type: Schema.Types.ObjectId, ref: 'id' },
  clientId: { type: String, required: true },
  blacklist: { type: Object, required: true },
  commandPrivileges: { type: Object, required: true },
  status: { type: String, required: true },
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
  clientId: '1146155436496670820',
  blacklist: {
    '751206188791627877': {
      id: '751206188791627877',
      info: 'blacklist zen permanent',
      type: 'user',
      commands: 'all',
      date: Date.now(),
    },
  },
  commandPrivileges: {},
  status: 'online',
};

/**
 * The primary key of the table.
 */
export const PRIMARY_KEY: string = 'clientId' as const;
