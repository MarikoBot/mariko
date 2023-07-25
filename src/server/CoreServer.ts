import { Snowflake } from 'discord.js';

import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import { HydratedDocument } from 'mongoose';
import ClientConfig from '../res/ClientConfig';

/**
 * The core server.
 */
export default class CoreServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Core.Model);
  }

  /**
   * Get the core from the database.
   * @param clientId The player id.
   * @returns The player.
   */
  public async find(clientId: Snowflake = ClientConfig.defaultClientId): Promise<{}> {
    return await this.mongooseModel.findOne({ clientId }).exec();
  }

  /**
   * Create a new core instance.
   * @param clientId The player id.
   * @returns The created player.
   */
  public async create(clientId: Snowflake = ClientConfig.defaultClientId): Promise<void> {
    const entry: HydratedDocument<models.Core.Interface> = new this.mongooseModel({ clientId });
    await entry.save();
  }
}
