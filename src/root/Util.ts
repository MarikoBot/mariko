// noinspection JSUnusedGlobalSymbols

import { Client, Embed, Guild, GuildBasedChannel, GuildMember, Message, Snowflake, User } from 'discord.js';
import { ContextChannel } from './Context';
import * as chalk from 'chalk';

/**
 * Logs a message to the console.
 * @param args The message to log.
 * @returns Void.
 */
export function log(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.blue('⟦MARIKO LOG⟧'), chalk.blue(arg.message || arg));
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "test" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function test(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.magenta('⟦MARIKO TEST⟧'));
    console.log(arg.message || arg);
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "error" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function err(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.red('⟦MARIKO ERROR⟧'), chalk.red(arg.message || arg));
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "caught error" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function caught(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.magenta('⟦MARIKO ERROR⟧'));
    console.log(chalk.magenta(arg.message || arg));
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "clean error" tag.
 * @param args The message to log.
 * @returns Void.
 */
export function clean(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.green('⟦MARIKO ERROR⟧'));
    console.log(chalk.green(arg.message || arg));
  });
}

/**
 * The equivalent of setTimeout, but asynchronous.
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Void.
 */
export async function timeout(fn: (...args: any[]) => any, ms: number): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return fn(...arguments);
}

/**
 * A function that gets the GuildMember instance with the given ID.
 * @param client The client instance.
 * @param guildID The guild ID.
 * @param member The member ID or username.
 * @returns The GuildMember instance.
 */
export async function SFToMember(client: Client, guildID: Snowflake, member: string): Promise<GuildMember> {
  if (!client || !(client instanceof Client)) throw new Error('Invalid client provided.');

  const guild: Guild = await client.guilds.fetch(guildID);
  let memberInstance: GuildMember = guild.members.resolve(member);
  if (!memberInstance) {
    memberInstance = guild.members.cache.find((m: GuildMember): boolean => m.user.tag.startsWith(member));
  }
  return memberInstance;
}

/**
 * A function that gets the User instance with the given ID.
 * @param client The client instance.
 * @param user The user ID or username.
 * @returns The User instance.
 */
export async function SFToUser(client: Client, user: string): Promise<User> {
  if (!client || !(client instanceof Client)) throw new Error('Invalid client provided.');

  let userInstance: User = client.users.resolve(user);
  if (!userInstance) {
    userInstance = client.users.cache.find((u: User): boolean => u.tag.startsWith(user));
  }
  return userInstance;
}

/**
 * A function that gets the Channel instance with the given ID.
 * @param client The client instance.
 * @param guildID The guild ID.
 * @param channel The channel ID or name.
 * @returns The Channel instance.
 */
export async function SFToCtxChannel(client: Client, guildID: Snowflake, channel: Snowflake): Promise<ContextChannel> {
  if (!client || !(client instanceof Client)) throw new Error('Invalid client provided.');

  const guild: Guild = await client.guilds.fetch(guildID);
  let channelInstance: GuildBasedChannel = guild.channels.resolve(channel);
  if (!channelInstance)
    channelInstance = guild.channels.cache.find((c: GuildBasedChannel): boolean => c.name.startsWith(channel));

  return channelInstance as ContextChannel;
}

/**
 * Get a message embed content.
 * @param message The message to read.
 * @returns The message content.
 */
export function readEmbeds(message: Message): string {
  return message.embeds
    .map((value: Embed): string => `${value.title || ''} - ${value.description || ''}`)
    .reduce((previousValue: string, currentValue: string): string => `${previousValue} - ${currentValue}`);
}

/**
 * The vowels of the alphabet.
 */
export const Vowels = ['a', 'e', 'i', 'o', 'u', 'y'] as const;

/**
 * Extract the data from a string, applying a regular expression to match the data.
 * @param regexp The RegExp to match on.
 * @param str The string to test on.
 * @returns The matching value.
 */
export function extractString(regexp: RegExp, str: string): string | null {
  const matches: RegExpMatchArray = str.match(regexp);

  if (matches && matches.length > 1) return matches[1];

  return null;
}

/**
 * The Colors enum. These are the colors used in the embeds.
 */
export const Colors = {
  RED: 0xff4848,
  ORANGE: 0xff7526,
  YELLOW: 0xffec80,
  GREEN: 0x36ff6d,
  BLUE: 0x454bff,
  PURPLE: 0xc167ff,
  WHITE: 0xebebeb,
  DARK: 0x2c2d31,
} as const;

/**
 * Capitalize the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function cap(str: string): string {
  return str.split('')[0].toUpperCase() + str.split('').slice(1);
}

/**
 * Returns the current date for a Discord timestamp.
 * @param date The date number.
 * @returns The string.
 */
export function discordDate(date: number = Date.now()): string {
  return (date / 1000).toFixed(0);
}
