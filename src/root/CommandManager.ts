import {
  ApplicationCommandOptionData,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  Collection,
  CommandInteractionOption,
  PermissionFlagsBits,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from 'discord.js';

import { ApplicationCommandOptionType } from 'discord-api-types/v10';

import Command from './Command';
import CoolDownManager from './CoolDownManager';
import InterferingManager from './InterferingManager';
import SuperClient from './SuperClient';
import { CommandType } from './Command';

/**
 * Represents the command manager of the client.
 */
export default class CommandManager {
  /**
   * The client instance.
   */
  public readonly client: SuperClient;
  /**
   * The cool down manager instance, to have access to the different delays of the current commands.
   */
  public readonly CoolDowns: CoolDownManager;
  /**
   * The interfering manager instance, to have access to the different executing commands.
   */
  public readonly Interfering: InterferingManager;
  /**
   * The collection of the commands.
   */
  public readonly commandsList: Collection<string, Command> = new Collection();
  /**
   * The list including all the fullNames of each command.
   */
  public fullNameCommandsList: Command['data']['fullName'][] = [];

  /**
   * The constructor of the command manager.
   *
   * @param client The client instance.
   */
  constructor(client: SuperClient) {
    this.client = client;
    this.CoolDowns = new CoolDownManager(this.client);
    this.Interfering = new InterferingManager(this.client);
  }

  /**
   * Create a command based on the name and/or some options, and returns it.
   *
   * @param data The name and/or the options.
   * @returns The command instance.
   */
  public create(data: string | CommandType): Command {
    if (typeof data === 'string') {
      data = {
        name: data,
        description: 'No description provided.',
        execute: async (): Promise<void> => {
          void setTimeout((): null => null);
        },
      };
    }
    if (!data.type) data.type = 1;

    const desc: string = data?.description;
    if (!desc) {
      data.description = 'No description provided.';
    }

    return new Command(this.client, data);
  }

  /**
   * Add a command to the client (the bot) using the name, options or the command itself.
   * If no command is passed, the function creates one based on the data passed.
   *
   * @param commandData The options passed (name, command options, command instance).
   * @returns The command manager instance (this).
   */
  public add(commandData: string | CommandType | Command): CommandManager {
    if (commandData instanceof Command) {
      this.commandsList.set(commandData.data.name, commandData);
      return this;
    }
    const command: Command = this.create(commandData);
    this.commandsList.set(command.data.name, command);
    return this;
  }

  /**
   * Generates the fullName list.
   *
   * @returns The list.
   */
  public generateFullList(): CommandManager['fullNameCommandsList'] {
    let commandNames: string[] = [];
    for (const command of this.commandsList.map((e: Command) => e)) {
      commandNames.push(command.data.name);

      for (const opt of command.data.options) {
        if (opt.type === ApplicationCommandOptionType['Subcommand'])
          commandNames.push(`${command.data.name} ${opt.name}`);
        if (opt.type === ApplicationCommandOptionType['SubcommandGroup']) {
          const groupNames: string[] = [];

          for (const sub of opt.options) {
            groupNames.push(`${command.data.name} ${opt.name} ${sub.name}`);
          }
          commandNames = commandNames.concat(groupNames);
        }
      }
    }

    this.fullNameCommandsList = commandNames;
    return this.fullNameCommandsList;
  }

  /**
   * Get a command from the cache with the name.
   *
   * @param interaction The interaction.
   * @returns The found command instance, or undefined.
   */
  public getCommand(interaction: ChatInputCommandInteraction): Command | undefined {
    let command: Command = this.commandsList.get(interaction.commandName);
    const commandName: string = command.data.name;
    let subName: string = '';
    let groupName: string = '';
    let optionsData: readonly CommandInteractionOption[] = interaction.options.data;

    const thereIsGroup: CommandInteractionOption[] = optionsData.filter(
      (elt: CommandInteractionOption): boolean => elt.type === ApplicationCommandOptionType['SubcommandGroup'],
    );

    if (thereIsGroup.length > 0) {
      const group: ApplicationCommandOptionData = command.data.options.filter(
        (opt: ApplicationCommandOptionData): boolean => opt.name === thereIsGroup[0].name,
      )[0];
      groupName = group.name;
      command = this.create(group as unknown as CommandType);
      optionsData = thereIsGroup[0].options;
    }
    const thereIsSub: CommandInteractionOption[] = optionsData.filter(
      (elt: CommandInteractionOption): boolean => elt.type === ApplicationCommandOptionType['Subcommand'],
    );
    if (thereIsSub.length > 0) {
      const sub: ApplicationCommandOptionData = command.data.options.filter(
        (opt: ApplicationCommandOptionData): boolean => opt.name === thereIsSub[0].name,
      )[0];
      subName = sub.name;
      command = this.create(sub as unknown as CommandType);
    }

    command.data.fullName = `${commandName} ${groupName} ${subName}`;
    return command;
  }

  /**
   * Build a slash command with options on it.
   * @param commandData The data of the command
   * @param builder The already built organ.
   * @returns The built slash command.
   */
  public static buildSlashCommand(
    commandData: ChatInputApplicationCommandData,
    builder: SlashCommandBuilder,
  ): SlashCommandBuilder {
    builder
      .setNSFW(commandData.nsfw || false)
      .setDMPermission(commandData.dmPermission || false)
      .setDefaultMemberPermissions(
        commandData.defaultMemberPermissions?.toString() || PermissionFlagsBits['ViewChannel'],
      );

    if (!commandData.options) return builder;

    for (const opt of commandData.options) {
      switch (opt.type) {
        case ApplicationCommandOptionType['Attachment']:
          builder.addAttachmentOption(opt as SlashCommandAttachmentOption);
          break;
        case ApplicationCommandOptionType['Boolean']:
          builder.addBooleanOption(opt as SlashCommandBooleanOption);
          break;
        case ApplicationCommandOptionType['Channel']:
          builder.addChannelOption(opt as SlashCommandChannelOption);
          break;
        case ApplicationCommandOptionType['Integer']:
          builder.addIntegerOption(opt as SlashCommandIntegerOption);
          break;
        case ApplicationCommandOptionType['Mentionable']:
          builder.addMentionableOption(opt as SlashCommandMentionableOption);
          break;
        case ApplicationCommandOptionType['Number']:
          builder.addNumberOption(opt as SlashCommandNumberOption);
          break;
        case ApplicationCommandOptionType['Role']:
          builder.addRoleOption(opt as SlashCommandRoleOption);
          break;
        case ApplicationCommandOptionType['String']:
          builder.addStringOption(opt as SlashCommandStringOption);
          break;
        case ApplicationCommandOptionType['User']:
          builder.addUserOption(opt as SlashCommandUserOption);
          break;
        default:
          break;
      }
    }

    return builder;
  }
}
