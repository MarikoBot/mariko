import * as models from '../models';
import BaseServer from './BaseServer';
import Client from '../root/Client';
import ClientConfig from '../res/ClientConfig';
import { BlacklistData, CommandPrivileges } from '../models/Core';
import { TestedModalSubitFields } from '../service/adminPanel/panels/blacklist';

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

    /* for (let i = 0; i < 0; i-=-1) {
      data.blacklist[String(i)] = {
        id: String(i),
        info: `testing ${i}`,
        type: 'guild',
        commands: 'all',
        date: Date.now(),
      };
    }*/

    return Object.values(data.blacklist);
  }

  /**
   * Add an element to the blacklist.
   * @param element The fields of the element to add.
   * @returns Nothing.
   */
  public async blacklistElement(element: TestedModalSubitFields): Promise<void> {
    const idValue: string = element.data.get('id').value;
    const typeValue: string = element.data.get('type').value;
    const infoValue: string = element.data.get('info').value;
    const commandsValue: string = element.data.get('commands').value;

    const blacklistData: BlacklistData = {
      id: idValue,
      type: typeValue as 'guild' | 'user',
      info: infoValue,
      commands: commandsValue === 'all' ? commandsValue : commandsValue.split(', '),
      date: Date.now(),
    };

    const blacklist: models.Core.Interface['blacklist'] = (
      (await this.find({
        clientId: ClientConfig.defaultClientId,
      })) as models.Core.Interface
    ).blacklist;

    blacklist[idValue] = blacklistData;

    await this.updateCore({ blacklist });
  }

  /**
   * Remove an element from the blacklist.
   * @param elementPos The element position on the panel. Not the element ID.
   * @returns Nothing.
   */
  public async unblacklistElement(elementPos: string): Promise<void> {
    const blacklistArray: models.Core.BlacklistData[] = await this.getBlacklist();

    const blacklistData: models.Core.Interface['blacklist'] = (
      (await this.find({
        clientId: ClientConfig.defaultClientId,
      })) as models.Core.Interface
    ).blacklist;

    if (Number(elementPos) > blacklistArray.length) return;
    const element: models.Core.BlacklistData = blacklistArray[Number(elementPos)];

    delete blacklistData[element.id];

    await this.updateCore({ blacklist: blacklistData });
  }
}
