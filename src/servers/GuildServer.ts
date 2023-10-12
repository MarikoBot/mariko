// noinspection JSUnusedGlobalSymbols

import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';

/**
 * The guild server.
 */
export default class GuildServer extends BaseServer {
  /**
   * The constructor of the guild server.
   *
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Guild as any);
  }

  /**
   * Create a new guild.
   *
   * @param discordId The guild id.
   * @returns Nothing.
   */
  public async createPlayer(discordId: Snowflake): Promise<void> {
    await this.create({
      discordId,
    });
  }
}
