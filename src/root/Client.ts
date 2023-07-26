import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import * as fs from 'fs';

import defaultData from '../res/ClientConfig';
import { CommandType } from './Command';
import CommandManager from './CommandManager';
import EventManager from './EventManager';
import * as Event from './Event';
import PlayerServer from '../server/PlayerServer';
import UserServer from '../server/UserServer';
import GuildServer from '../server/GuildServer';
import CoreServer from '../server/CoreServer';
import LanguageManager from './LanguageManager';
import GameService from '../service/game/';

/**
 * The default structure of the game servers.
 */
interface ServerInterface {
  Player: PlayerServer;
  Guild: GuildServer;
  User: UserServer;
  Core: CoreServer;
}

/**
 * The default structure of service.
 */
interface ServiceInterface {
  Game: typeof GameService;
}

/**
 * The pre-configured client class for the bot.
 */
export default class extends Client {
  /**
   * The directory to load the commands from.
   */
  public commandsDir: string = defaultData.commandsDir;
  /**
   * The command manager instance.
   */
  public readonly Commands: CommandManager = new CommandManager(this);
  /**
   * The event manager instance.
   */
  public readonly Events: EventManager = new EventManager(this);
  /**
   * The database collections interface.
   */
  public readonly Server: ServerInterface = {
    Player: new PlayerServer(this),
    Guild: new GuildServer(this),
    User: new UserServer(this),
    Core: new CoreServer(this),
  };
  /**
   * The service handler interface.
   */
  public readonly Service: ServiceInterface = {
    Game: GameService,
  };
  /**
   * The language manager for accessing strings.
   */
  public readonly Languages: LanguageManager = new LanguageManager(this);

  /**
   * The constructor of the client.
   */
  constructor() {
    super({
      intents: defaultData.intents,
      failIfNotExists: defaultData.failIfNotExists,
      presence: defaultData.presence,
    });
  }

  /**
   * The function to load the commands.
   * @returns {Promise<void>}
   */
  public async loadCommands(): Promise<void> {
    const dir: string[] = fs.readdirSync(`./lib/${this.commandsDir}`);
    const commandsList: ApplicationCommandDataResolvable[] = [];

    for (const file of dir) {
      const command: CommandType = require(`../${this.commandsDir}/${file}`).default as CommandType;
      commandsList.push(command);
      this.Commands.add(command);
    }

    if (defaultData.loadCommands) await this.application.commands.set(commandsList);
  }

  /**
   * Launch the client after bounding events and sending commands to the API, if necessary.
   * Returns a simple string.
   * @param token The client token, if not specified before.
   * @returns A string constant "Logged in."
   */
  public async login(token?: string): Promise<string> {
    this.Events.events.each((event: Event.default): void => {
      if (event.name !== 'voiceStateUpdate') {
        const method: string = event.name === 'ready' ? 'once' : 'on';
        (this as { [index: string]: any })[method](event.name, (...args: any[]): void => {
          event.callback(this, ...args);
        });
      }
    });

    const logged: string = await super.login(token || this.token);
    await this.loadCommands();

    return logged;
  }
}
