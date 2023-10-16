// noinspection JSUnusedGlobalSymbols

import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import SuperClient from '../root/SuperClient';

/**
 * The salesperson server.
 */
export default class SalespersonServer extends BaseServer {
  /**
   * The constructor of the salesperson server.
   *
   * @param client The client instance.
   */
  constructor(client: SuperClient) {
    super(client, models.Salesperson as any);
  }

  /**
   * Create a new player.
   *
   * @param discordId The player id.
   * @param guildId The guild id.
   * @returns Nothing.
   */
  public async createSalesperson(discordId: Snowflake, guildId: Snowflake): Promise<void> {
    await this.create({
      discordId,
      guildId,
    });
  }
}
