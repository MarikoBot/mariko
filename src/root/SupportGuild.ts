import Client from './Client';
import ClientConfig from '../res/ClientConfig';
import { Guild, GuildMember, Role, Snowflake } from 'discord.js';
import { IdToGuild } from './Util';

/**
 * The main class that includes some functions for the support linked features.
 */
export default class SupportGuild {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The linked support guild id.
   */
  public guildId: Snowflake = ClientConfig.supportGuildId;
  /**
   * The linked support guild.
   */
  public guild: Guild;

  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Refreshes the linked guild data.
   */
  public async refreshSupport(): Promise<void> {
    this.guild = await IdToGuild(this.client, this.guildId);
  }

  /**
   * Get the list of members for each role.
   * @returns Nothing.
   */
  public get membersByRole(): Record<Snowflake, GuildMember[]> {
    const record: Record<Snowflake, GuildMember[]> = {};

    if (!this.guild) return;

    for (const [_, roleId] of Object.entries(ClientConfig.supportRoles))
      record[roleId] = this.guild.roles.cache.get(roleId).members.map((m) => m);

    return record;
  }

  /**
   * Compares two persons by their id and returns a boolean that designate if
   * the first one is stronger than the second one.
   * @param sourceId The first member id.
   * @param targetId The second member id.
   * @returns The boolean that designate if the first member take the priority on the second one.
   */
  public async takesPriority(sourceId: Snowflake, targetId: Snowflake): Promise<boolean> {
    const [source, target]: [GuildMember, GuildMember] = [
      this.guild.members.cache.get(sourceId),
      this.guild.members.cache.get(targetId),
    ];
    const membersByRole: Record<string, GuildMember[]> = this.membersByRole;

    let [i, j]: [number, number] = [-1, -1];
    for (let k = 0; k < Object.keys(membersByRole).length; k++) {
      const roleContent: GuildMember[] = Object.entries(membersByRole)[k][1];

      if (source.id in roleContent) i = k;
      if (target.id in roleContent) j = k;
    }

    return i > j;
  }
}
