import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import { HydratedDocument } from 'mongoose';
import { Language } from '../service/game/Typings';

/**
 * The user server.
 */
export default class UserServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.User.Model);
  }

  /**
   * Get a user from the database.
   * @param discordId The discord id.
   * @returns The user.
   */
  public async find(discordId: Snowflake): Promise<{}> {
    return await this.mongooseModel.findOne({ discordId }).exec();
  }

  /**
   * Create a new user.
   * @param discordId The discord id.
   * @param language The language id.
   * @returns The created user.
   */
  public async create(discordId: Snowflake, language: Language): Promise<void> {
    const entry: HydratedDocument<models.User.Interface> = new this.mongooseModel({
      discordId,
      language,
      subscriptions: {},
      rpgPremium: false,
      globalPremium: false,
    });
    await entry.save();
  }

  /**
   * Extract the language id from a user.
   * @param discordId The user ID.
   * @returns The user id. Returns 'fr' if not found.
   */
  public async getLanguage(discordId): Promise<Language> {
    const data: {} = await this.find(discordId);
    if (!data || !('language' in data)) return 'fr';

    return data.language as Language;
  }
}
