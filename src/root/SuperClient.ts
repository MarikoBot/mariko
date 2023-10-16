import {
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  ChatInputApplicationCommandData,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalSubmitInteraction,
} from 'discord.js';
import * as fs from 'fs';

import defaultData from '../res/ClientConfig';
import { CommandType } from './Command';
import CommandManager from './CommandManager';
import EventManager from './EventManager';
import * as Event from './Event';
import LanguageManager from './LanguageManager';
import GameService from '../service/game/';
import AdminPanelService, { TestedModalSubitFields } from '../service/adminPanel';
import PlayerServer from '../servers/PlayerServer';
import UserServer from '../servers/UserServer';
import GuildServer from '../servers/GuildServer';
import CoreServer from '../servers/CoreServer';
import SalespersonServer from '../servers/SalespersonServer';
import * as models from '../models';
import SupportGuild from './SupportGuild';
import { clean, Colors, discordDate } from './Util';
import Emojis from '../res/Emojis';
import Images from '../res/Images';

/**
 * The default structure of the servers.
 */
interface ServersInterface {
  /**
   * The player collection on mongo db.
   */
  Player: PlayerServer;
  /**
   * The guild collection on mongo db.
   */
  Guild: GuildServer;
  /**
   * The user collection on mongo db.
   */
  User: UserServer;
  /**
   * The core collection on mongo db.
   */
  Core: CoreServer;
  /**
   * The salesperson collection on mongo db.
   */
  Salesperson: SalespersonServer;
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
  /**
   * The game service.
   */
  Game: typeof GameService;
  /**
   * The admin panel service.
   */
  AdminPanel: typeof AdminPanelService;
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
  public readonly Servers: ServersInterface = {
    Player: new PlayerServer(this),
    Guild: new GuildServer(this),
    User: new UserServer(this),
    Core: new CoreServer(this),
    Salesperson: new SalespersonServer(this),
  };
  /**
   * The service handler interface.
   */
  public readonly Services: ServiceInterface = {
    Game: GameService,
    AdminPanel: AdminPanelService,
  };
  /**
   * The language manager for accessing strings.
   */
  public readonly Languages: LanguageManager = new LanguageManager(this);
  /**
   * The cached blacklist to avoid spamming the database.
   */
  public blacklist: models.Core.Interface['blacklist'];
  /**
   * The support guild features class.
   */
  public supportGuild: SupportGuild = new SupportGuild(this);

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
   *
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
        .setDefaultMemberPermissions(
          commandData.defaultMemberPermissions?.toString() || PermissionFlagsBits['ViewChannel'],
        );
    }

    return builder;
  }

  /**
   * The function to load the commands.
   *
   * @returns Nothing.
   */
  public async loadCommands(): Promise<void> {
    const dir: string[] = fs.readdirSync(`./lib/${this.commandsDir}`);
    const commandsList: SlashCommandBuilder[] = [];

    for (const rootCommandsDir of dir) {
      const commandDirElements: string[] = fs.readdirSync(`./lib/${this.commandsDir}/${rootCommandsDir}`);
      if (commandDirElements.length === 1 && commandDirElements[0] === 'index.js') {
        const commandType: CommandType = require(`../${this.commandsDir}/${rootCommandsDir}/index`)
          .default as CommandType;
        const materialized: SlashCommandBuilder = SuperClient.materializeBuilder(
          commandType,
          'slash',
        ) as SlashCommandBuilder;
        commandsList.push(Object.assign(materialized, commandType));
        continue;
      }

      const rootPath: string = `${this.commandsDir}/${rootCommandsDir}`;
      const commandBaseData: ChatInputApplicationCommandData =
        require(`../${this.commandsDir}/${rootCommandsDir}/index`).default;
      const command: SlashCommandBuilder = Object.assign(
        SuperClient.materializeBuilder(commandBaseData, 'slash') as SlashCommandBuilder,
        commandBaseData,
      );
      const includesFolder: boolean = commandDirElements.some((element: string): boolean => {
        return fs.statSync(`./lib/${rootPath}/${element}`).isDirectory();
      });

      for (const commandDirElement of commandDirElements) {
        let cmdOrGroup: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder = new SlashCommandBuilder();
        const elementFileOrFolder: fs.Stats = fs.statSync(`./lib/${rootPath}/${commandDirElement}`);

        if (elementFileOrFolder.isFile()) {
          const commandDataType: CommandType = require(`../${rootPath}/${commandDirElement}`).default as CommandType;
          if (commandDirElement === 'index.js') {
            const materializedOrgan: SlashOrganBuilder = SuperClient.materializeBuilder(commandDataType, 'slash');
            cmdOrGroup = includesFolder
              ? (materializedOrgan as SlashCommandSubcommandGroupBuilder)
              : (materializedOrgan as SlashCommandBuilder);
            continue;
          }
          const materialized: SlashCommandSubcommandBuilder = SuperClient.materializeBuilder(
            commandDataType,
            'sub',
          ) as SlashCommandSubcommandBuilder;
          const assigned = Object.assign(materialized, commandDataType);
          cmdOrGroup.addSubcommand(assigned);
        }
        if (!elementFileOrFolder.isDirectory()) continue;

        const subcommandGroupsList: string[] = fs.readdirSync(`./lib/${rootPath}/${commandDirElement}/`);

        let commandData: CommandType = require(`../${rootPath}/${commandDirElement}/index.js`).default as CommandType;
        cmdOrGroup = Object.assign(
          SuperClient.materializeBuilder(commandData, 'group') as SlashCommandSubcommandGroupBuilder,
          commandData,
        );

        for (const subcommandFile of subcommandGroupsList) {
          if (subcommandFile === 'index.js') continue;
          commandData = require(`../${rootPath}/${commandDirElement}/${subcommandFile}`).default as CommandType;

          const materialized = SuperClient.materializeBuilder(commandData, 'sub') as SlashCommandSubcommandBuilder;
          cmdOrGroup.addSubcommand(Object.assign(materialized, commandData));
        }
        command.addSubcommandGroup(cmdOrGroup as SlashCommandSubcommandGroupBuilder);
      }
      commandsList.push(command);
    }

    for (const command of commandsList) {
      this.Commands.add(command as unknown as CommandType);
    }
    if (defaultData.loadCommands) await this.application.commands.set(commandsList);

    this.Commands.generateFullList();
  }

  /**
   * Launch the client after bounding events and sending commands to the API, if necessary.
   * Returns a simple string.
   *
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

  /**
   * Function that send a reply based on a tested content.
   *
   * @param tested The tested fields of the modal.
   * @param messages The associated messages.
   * @param interaction The associated interaction.
   * @returns Nothing.
   */
  public async printBack(
    tested: TestedModalSubitFields,
    messages: Record<'valid' | 'invalid', string>,
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction,
  ): Promise<void> {
    const finalEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor(tested.valid ? Colors.GREEN : Colors.RED)
      .setImage(tested.valid ? Images.coloredCheck : Images.coloredCancel);

    if (tested.valid) {
      finalEmbed.setDescription(`<t:${discordDate()}:T>・${messages['valid']}`);

      if (tested.errors.length > 0) {
        finalEmbed.setImage(Images.coloredWarning);
        finalEmbed.addFields({
          name: `${Emojis.coloredWarning} Warnings:`,
          value: `>>> ${tested.errors.join('\n')}`,
        });
      }
    } else {
      finalEmbed.setDescription(`<t:${discordDate()}:T>・${messages['invalid']}`);

      if (tested.errors.length > 0) {
        finalEmbed.addFields({
          name: `${Emojis.coloredCancel} Errors:`,
          value: `>>> ${tested.errors.join('\n')}`,
        });
      }
    }

    await interaction.reply({ embeds: [finalEmbed], ephemeral: true }).catch(clean);
  }
}
