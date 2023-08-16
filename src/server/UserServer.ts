import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import { Language } from '../service/game/Typings';

/**
 * The user server.
 */
export default class UserServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.User as any);
  }

  /**
   * Create a new user.
   * @param discordId The discord id.
   * @param language The language id.
   * @returns The created user.
   */
  public async createUser(discordId: Snowflake, language: Language): Promise<void> {
    await this.create({
      discordId,
      language,
    });
  }

  /**
   * Extract the language id from a user.
   * @param discordId The user ID.
   * @returns The user id. Returns 'fr' if not found.
   */
  public async getLanguage(discordId: Snowflake): Promise<Language> {
    const data: {} = await this.find({ discordId });
    if (!data || !('language' in data)) return 'en';

    return data.language as Language;
  }
}
