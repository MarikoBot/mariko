import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';

/**
 * The player server.
 */
export default class SalespersonServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Salesperson);
  }

  /**
   * Create a new player.
   * @param discordId The player id.
   * @param guildId The guild id.
   * @returns The created salesperson.
   */
  public async createSalesperson(discordId: Snowflake, guildId: Snowflake): Promise<void> {
    await this.create({
      discordId,
      guildId,
    });
  }
}
