import {
  ApplicationCommandData,
  ApplicationCommandDataResolvable,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  ChatInputApplicationCommandData,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
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
import { test } from './Util';

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
 * The type that includes the three builders.
 */
export type SlashOrganBuilder =
  | SlashCommandBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandSubcommandGroupBuilder;

/**
 * The default structure of service.
 */
interface ServiceInterface {
  Game: typeof GameService;
}

/**
 * The pre-configured client class for the bot.
 */
export default class SuperClient extends Client {
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
   * Generates a slash command builder instance from a CommandType typed object.
   * @param commandData The command data.
   * @param builderType Specify if the builder to return concerns a command, sub command or sub command group.
   * @returns The builder instance.
   */
  public static materializeBuilder(
    commandData: ChatInputApplicationCommandData | ApplicationCommandSubCommandData | ApplicationCommandSubGroupData,
    builderType: 'slash' | 'sub' | 'group',
  ): SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder {
    let builder: SlashOrganBuilder = {
      slash: new SlashCommandBuilder(),
      sub: new SlashCommandSubcommandBuilder(),
      group: new SlashCommandSubcommandGroupBuilder(),
    }[builderType];

    builder
      .setName(commandData.name)
      .setNameLocalization('en-US', commandData.name)
      .setNameLocalizations(Object.assign({ 'en-US': commandData.name }, commandData.nameLocalizations || {}))
      .setDescription(commandData.description || 'No description yet.')
      .setDescriptionLocalization('en-US', commandData.description || 'No description yet.')
      .setDescriptionLocalizations(
        Object.assign({ 'en-US': commandData.description }, commandData.descriptionLocalizations || {}),
      );

    if (builderType === 'slash') {
      commandData = commandData as ChatInputApplicationCommandData;
      builder = builder as SlashCommandBuilder;
      builder
        .setNSFW(commandData.nsfw || false)
        .setDMPermission(commandData.dmPermission || false)
        .setDefaultMemberPermissions(commandData.defaultMemberPermissions?.toString() || 0);
    }

    return builder;
  }

  /**
   * The function to load the commands.
   * @returns {Promise<void>}
   */
  public async loadCommands(): Promise<void> {
    const dir: string[] = fs.readdirSync(`./lib/${this.commandsDir}`);
    const commandsList: SlashCommandBuilder[] = [];

    for (const rootCommandsDir of dir) {
      const commandDirElements: string[] = fs.readdirSync(`./lib/${this.commandsDir}/${rootCommandsDir}`);
      if (commandDirElements.length === 1) {
        const command: CommandType = require(`../${this.commandsDir}/${rootCommandsDir}/index`).default as CommandType;
        const materialized: SlashCommandBuilder = SuperClient.materializeBuilder(
          command,
          'slash',
        ) as SlashCommandBuilder;
        commandsList.push(materialized);
        continue;
      }

      const rootPath: string = `${this.commandsDir}/${rootCommandsDir}`;
      let defaultCommandData: CommandType;
      let builder: SlashCommandBuilder = new SlashCommandBuilder();
      let subcommands: (SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder)[] = [];

      for (const commandDirElement of commandDirElements) {
        const elementFileOrFolder: fs.Stats = fs.statSync(`./lib/${rootPath}/${commandDirElement}`);

        if (elementFileOrFolder.isFile()) {
          let commandData: CommandType = require(`../${rootPath}/${commandDirElement}`).default as CommandType;
          if (commandDirElement === 'index.js') {
            defaultCommandData = commandData;
            builder = SuperClient.materializeBuilder(defaultCommandData, 'slash') as SlashCommandBuilder;
          } else {
            const materialized: SlashCommandSubcommandBuilder = SuperClient.materializeBuilder(
              commandData,
              'sub',
            ) as SlashCommandSubcommandBuilder;
            const assigned = Object.assign(materialized, commandData);
            subcommands.push(assigned);
          }
        }
        if (!elementFileOrFolder.isDirectory()) continue;

        const subcommandGroupsList: string[] = fs.readdirSync(`./lib/${rootPath}/${commandDirElement}/`);
        let subcommandGroup: SlashCommandSubcommandGroupBuilder = new SlashCommandSubcommandGroupBuilder();

        for (const subcommandFile of subcommandGroupsList) {
          let commandData: CommandType = require(`../${rootPath}/${commandDirElement}/${subcommandFile}`)
            .default as CommandType;

          if (subcommandFile === 'index.js') {
            subcommandGroup = SuperClient.materializeBuilder(
              commandData,
              'group',
            ) as SlashCommandSubcommandGroupBuilder;
          } else {
            const materialized = SuperClient.materializeBuilder(commandData, 'sub') as SlashCommandSubcommandBuilder;
            subcommandGroup.addSubcommand(materialized);
            subcommands.push(subcommandGroup);
          }
        }
      }
      if (subcommands.length > 0) {
        if (subcommands[0] instanceof SlashCommandSubcommandBuilder)
          for (const sub of subcommands) builder.addSubcommand(sub as SlashCommandSubcommandBuilder);
        if (subcommands[0] instanceof SlashCommandSubcommandGroupBuilder)
          for (const sub of subcommands) builder.addSubcommandGroup(sub as SlashCommandSubcommandGroupBuilder);
      }
      commandsList.push(builder);
    }

    for (const command of commandsList) {
      this.Commands.add(command as unknown as CommandType);
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
