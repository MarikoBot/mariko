import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import ClientConfig from '../res/ClientConfig';
import { BlacklistData, CommandPrivileges } from '../models/Core';
import { Snowflake } from 'discord.js';

/**
 * The core server.
 */
export default class CoreServer extends BaseServer {
  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    super(client, models.Core as any);
  }

  /**
   * Get the command privileges for a specified command in an external loading purpose.
   * @param commandName The command name.
   * @returns The external data.
   */
  public async getExternalPrivileges(commandName: string): Promise<CommandPrivileges> {
    const data: models.Core.Interface = (await this.find({
      clientId: ClientConfig.defaultClientId,
    })) as models.Core.Interface;
    return data.commandPrivileges?.[commandName] || {};
  }

  /**
   * Create a new core.
   * @returns Nothing.
   */
  public async createCore(): Promise<any> {
    return await this.create({ clientId: ClientConfig.defaultClientId });
  }

  /**
   * Get the core data.
   * @returns The core data.
   */
  public async getCore(): Promise<any> {
    return await this.find({ clientId: ClientConfig.defaultClientId });
  }

  /**
   * Update the core.
   * @param data The data to update.
   * @returns The core data.
   */
  public async updateCore(data: object): Promise<any> {
    return await this.update({ clientId: ClientConfig.defaultClientId }, data);
  }

  /**
   * Get the blacklist.
   * @returns The blacklist.
   */
  public async getBlacklist(): Promise<models.Core.BlacklistData[]> {
    const data: models.Core.Interface = (await this.find({
      clientId: ClientConfig.defaultClientId,
    })) as models.Core.Interface;

    for (let i = 0; i < 100; i++) {
      data.blacklist[String(i)] = {
        id: String(i),
        info: `testing ${i}`,
        type: 'guild',
        commands: 'all',
        date: Date.now(),
      };
    }

    return Object.values(data.blacklist);
  }
}
