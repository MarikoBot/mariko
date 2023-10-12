// noinspection JSUnusedGlobalSymbols

import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';

/**
 * The player server.
 */
export default class PlayerServer extends BaseServer {
  /**
   * The constructor of the player server.
   *
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Player as any);
  }

  /**
   * Create a new player.
   *
   * @param discordId The player id.
   * @param username The player username.
   * @param race The player race.
   * @param art The player art.
   * @param way The player way.
   * @returns Nothing.
   */
  public async createPlayer(
    discordId: Snowflake,
    username: string = 'Tanaka Ken',
    race: string = 'human',
    art: string = 'water',
    way: string = 'warrior',
  ): Promise<void> {
    await this.create({
      discordId,
      username,
      race,
      art,
      way,
    });
  }
}
