import { ChatInputApplicationCommandData, ChatInputCommandInteraction, GuildMemberRoleManager } from 'discord.js';

import Client from './Client';
import Context from './Context';
import { CommandPrivileges } from '../models/Core';

/**
 * The type that represents a command with an additional function.
 */
export type CommandType = ChatInputApplicationCommandData & {
  /**
   * The command full name defined by the subcommands and subcommand groups.
   */
  fullName?: string;
  /**
   * The function that will be executed when the command is called.
   */
  execute: (client: Client, interaction: ChatInputCommandInteraction, ctx: Context) => Promise<void>;
  /**
   * The commands that must be executed before this one.
   * If one of the interfering commands is currently running, this command will be ignored.
   */
  interferingCommands?: ChatInputApplicationCommandData['name'][];
  /**
   * The amount of time before running the command again. Must be between 0 and 300 seconds.
   */
  coolDown?: number;
};

/**
 * The class that represents a command.
 */
export default class Command {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The data of the command.
   */
  public readonly data: CommandType;
  /**
   * The function that will be executed when the command is called.
   */
  public execute: CommandType['execute'];
  /**
   * The context of the command.
   */
  public ctx: Context | undefined;
  /**
   * The external data for the command.
   */
  public external?: CommandPrivileges;

  /**
   * The constructor of the command.
   */
  constructor(client: Client, data: CommandType) {
    this.client = client;
    this.data = data;
    this.execute = data.execute;
  }

  /**
   * End the command. Call it when you want the command to be considered as finished and remove it from the interfering queue.
   * @returns Void.
   */
  public end(): void {
    if (!this.ctx) return;
    if (!this.ctx.interaction) return;

    this.client.Commands.Interfering.removeInterfering(this.ctx.interaction.user.id, this.ctx.interaction.id);
  }

  /**
   * Returns if the user is authorized to execute the command.
   * @param interaction The interaction of the command.
   * @returns If the user can execute the command.
   */
  public async isAuthorized(interaction: ChatInputCommandInteraction): Promise<boolean> {
    this.external = await this.client.Server.Core.getExternalPrivileges(this.data.name);
    if (interaction.inGuild()) {
      const forbiddenGuild: boolean =
        this.external.forbiddenGuilds && this.external.forbiddenGuilds.includes(interaction.guildId);
      if (forbiddenGuild) {
        await this.ctx.reply(this.ctx.translate('forbiddenGuild'));
        return false;
      }
      if (interaction.channel.id) {
        const forbiddenChannel: boolean =
          this.external.forbiddenChannels && this.external.forbiddenChannels.includes(interaction.channel.id);
        if (forbiddenChannel) {
          await this.ctx.reply(this.ctx.translate('forbiddenChannel'));
          return false;
        }
      }
      if (interaction.member) {
        const forbiddenRoles: boolean =
          this.external.forbiddenRoles &&
          this.external.forbiddenRoles.some((role: string) =>
            (interaction.member?.roles as GuildMemberRoleManager).cache.has(role),
          );
        if (forbiddenRoles) {
          await this.ctx.reply(this.ctx.translate('forbiddenRole'));
          return false;
        }
      }
    }
    const forbiddenUser: boolean =
      this.external.forbiddenUsers && this.external.forbiddenUsers.includes(interaction.user.id);
    if (forbiddenUser) {
      await this.ctx.reply(this.ctx.translate('forbiddenUser'));
      return false;
    }
    return true;
  }

  /**
   * Returns if the user is authorized in case of unique concept to execute the command.
   * @param interaction The interaction of the command.
   * @returns If the user can execute the command.
   */
  public async isAuthorizedAsUnique(interaction: ChatInputCommandInteraction): Promise<boolean> {
    this.external = await this.client.Server.Core.getExternalPrivileges(this.data.fullName);
    if (interaction.inGuild()) {
      const uniqueGuild: boolean =
        this.external.uniqueGuilds && !this.external.uniqueGuilds.includes(interaction.guildId);
      if (uniqueGuild) {
        await this.ctx.reply(this.ctx.translate('uniqueGuild'));
        return false;
      }
      if (interaction.channel.id) {
        const uniqueChannel: boolean =
          this.external.uniqueChannels && !this.external.uniqueChannels.includes(interaction.channel.id);
        if (uniqueChannel) {
          await this.ctx.reply(this.ctx.translate('uniqueChannel'));
          return false;
        }
      }
      if (interaction.member) {
        const uniqueRoles: boolean =
          this.external.uniqueRoles &&
          this.external.uniqueRoles.every(
            (role: string) => !(interaction.member?.roles as GuildMemberRoleManager).cache.has(role),
          );
        if (uniqueRoles) {
          await this.ctx.reply(this.ctx.translate('uniqueRole'));
          return false;
        }
      }
    }
    const uniqueUser: boolean = this.external.uniqueUsers && !this.external.uniqueUsers.includes(interaction.user.id);
    if (uniqueUser) {
      await this.ctx.reply(this.ctx.translate('uniqueUser'));
      return false;
    }
    return true;
  }
}
