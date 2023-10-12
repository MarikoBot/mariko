import Blacklisting from './Blacklisting';
import { Monitoring } from './Monitoring';
import CommandsPrivilegesSetting from './CommandsPrivilegesSetting';
import Client from '../../root/Client';
import Context from '../../root/Context';
import { Snowflake } from 'discord.js';
import { IdToCtxChannel } from '../../root/Util';

/**
 * The default class of the file.
 * Includes useful methods for getting assets.
 */
export class Index {
  /**
   * Client instance.
   */
  public client: Client;
  /**
   * The context of the action.
   */
  public ctx: Context;

  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Generate a blacklisting panel.
   */
  get blacklisting(): Blacklisting {
    return new Blacklisting(this.client, this.ctx);
  }

  /**
   * Generate a command privileges setting panel.
   */
  get commandPrivilegesSetting(): CommandsPrivilegesSetting {
    return new CommandsPrivilegesSetting(this.client, this.ctx);
  }

  /**
   * Generate a monitoring panel.
   */
  get monitoring(): Monitoring {
    return new Monitoring(this.client, this.ctx);
  }
}

/**
 * The channel of the context.
 *
 * @param client The client.
 * @param channel The channel of the context.
 * @param guild The guild of the context.
 * @returns An index instance.
 */
export default async function index(client: Client, channel: Snowflake, guild: Snowflake): Promise<Index> {
  const indexInstance: Index = new Index(client);
  indexInstance.ctx = new Context(await IdToCtxChannel(client, guild, channel), null, null, client.user);

  return indexInstance;
}
