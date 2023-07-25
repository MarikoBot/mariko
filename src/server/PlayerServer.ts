import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import { HydratedDocument } from 'mongoose';
import { weaponNames } from '../service/game/fr/Resources';

/**
 * The player server.
 */
export default class PlayerServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Player.Model);
  }

  /**
   * Get a player from the database.
   * @param discordId The player id.
   * @returns The player.
   */
  public async find(discordId: Snowflake): Promise<{}> {
    return await this.mongooseModel.findOne({ discordId }).exec();
  }

  /**
   * Create a new player.
   * @param discordId The player id.
   * @param username The player username.
   * @param race The player race.
   * @param art The player art.
   * @param way The player way.
   * @returns The created player.
   */
  public async create(
    discordId: Snowflake,
    username: string = 'Tanaka Ken',
    race: string = 'human',
    art: string = 'water',
    way: string = 'warrior',
  ): Promise<void> {
    const entry: HydratedDocument<models.Player.Interface> = new this.mongooseModel({
      discordId,
      username,
      experience: 0,
      race,
      art,
      way,
      pv: {
        current: 100,
        lastGain: 0,
      },
      power: {
        current: 100,
        lastGain: 0,
      },
      techniqueCategoryLevels: {
        basic: 1,
        fineness: 1,
        heavy: 1,
        ultimate: 1,
      },
      weapon: {
        id: 'katana',
        name: weaponNames.katana,
        durability: 100,
      },
      food: {},
      tools: {},
      weapons: {},
      location: {
        region: 'mount_sagiri',
        traveledFrom: null,
        traveledTo: 'mount_sagiri',
        traveledAt: 0,
      },
      activities: {
        /**
         * When the last forge started.
         */
        forgedAt: 0,
        /**
         * The number of hours to spend forging.
         */
        forgedTime: 0,
        /**
         * When the last fishing rod was launched.
         */
        fishedAt: 0,
        /**
         * When the last dig was done.
         */
        dugAt: 0,
      },
    });
    await entry.save();
  }
}
