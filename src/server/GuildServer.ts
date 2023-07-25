import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import { HydratedDocument } from 'mongoose';
import { Language } from '../service/game/Typings';

/**
 * The guild server.
 */
export default class GuildServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.User.Model);
  }

  /**
   * Get a guild from the database.
   * @param discordId The discord id.
   * @returns The guild.
   */
  public async find(discordId: Snowflake): Promise<{}> {
    return await this.mongooseModel.findOne({ discordId }).exec();
  }

  /**
   * Create a new guild.
   * @param discordId The discord id.
   * @returns The created guild.
   */
  public async create(discordId: Snowflake): Promise<void> {
    const entry: HydratedDocument<models.User.Interface> = new this.mongooseModel({
      discordId,
      subscriptions: {},
      guildPremium: false,
    });
    await entry.save();
  }
}
