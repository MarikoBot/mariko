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
    this.external = await this.client.Server.Core.getExternalPrivileges(this.data.fullName);
    const missing: string[] = [];
    let privileges: string = '0b0';
    const bitsRecord: Record<keyof CommandPrivileges, string> = {
      forbiddenUsers: '0b10000000',
      uniqueUsers: '0b1000000',
      forbiddenGuilds: '0b100000',
      uniqueGuilds: '0b10000',
      forbiddenRoles: '0b1000',
      uniqueRoles: '0b100',
      forbiddenChannels: '0b10',
      uniqueChannels: '0b1',
    };

    if (interaction.inGuild()) {
      const forbiddenGuild: boolean =
        this.external.forbiddenGuilds && this.external.forbiddenGuilds.includes(interaction.guildId);
      if (forbiddenGuild) missing.push('forbiddenGuilds');

      if (this.external.uniqueGuilds) {
        if (this.external.uniqueGuilds.includes(interaction.guildId)) privileges = bitsRecord['uniqueUsers'];
        else missing.push('uniqueUsers');
      }

      if (interaction.channel.id) {
        const forbiddenChannel: boolean =
          this.external.forbiddenChannels && this.external.forbiddenChannels.includes(interaction.channel.id);
        if (forbiddenChannel) missing.push('forbiddenChannels');

        if (this.external.uniqueChannels) {
          if (this.external.uniqueChannels.includes(interaction.channel.id))
            privileges =
              Number(privileges) > Number(bitsRecord['uniqueChannels']) ? privileges : bitsRecord['uniqueChannels'];
          else missing.push('uniqueChannels');
        }
      }
      if (interaction.member) {
        const forbiddenRoles: boolean =
          this.external.forbiddenRoles &&
          this.external.forbiddenRoles.some((role: string) =>
            (interaction.member?.roles as GuildMemberRoleManager).cache.has(role),
          );
        if (forbiddenRoles) missing.push('forbiddenRoles');

        if (this.external.uniqueRoles) {
          if (
            this.external.uniqueRoles.every((role: string) =>
              (interaction.member?.roles as GuildMemberRoleManager).cache.has(role),
            )
          )
            privileges =
              Number(privileges) > Number(bitsRecord['uniqueRoles']) ? privileges : bitsRecord['uniqueRoles'];
          else missing.push('uniqueRoles');
        }
      }
    }
    const forbiddenUser: boolean =
      this.external.forbiddenUsers && this.external.forbiddenUsers.includes(interaction.user.id);
    if (forbiddenUser) missing.push('forbiddenUsers');

    if (this.external.uniqueUsers) {
      if (this.external.uniqueUsers.includes(interaction.user.id))
        privileges = Number(privileges) > Number(bitsRecord['uniqueUsers']) ? privileges : bitsRecord['uniqueUsers'];
      else missing.push('uniqueUsers');
    }

    const highestMissing: string = missing.sort(
      (a: keyof CommandPrivileges, b: keyof CommandPrivileges) => Number(bitsRecord[b]) - Number(bitsRecord[a]),
    )[0];
    const isAuth: boolean = missing.length > 0 ? Number(highestMissing) < Number(privileges) : true;
    if (!isAuth) {
      await this.ctx.reply(
        this.ctx.translate(
          'privilegesLocked',
          `${missing.length}${missing
            .map((e: keyof CommandPrivileges) => Number(bitsRecord[e]))
            .reduce((acc: number, val: number) => acc + val, 0)}`,
        ),
      );
    }

    return isAuth;
  }
}
