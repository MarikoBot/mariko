// noinspection JSUnusedGlobalSymbols

import { Embed, Guild, GuildBasedChannel, Message, Snowflake, User } from 'discord.js';
import * as chalk from 'chalk';

import { ContextChannel } from './Context';
import SuperClient from './SuperClient';

/**
 * Logs a message to the console.
 *
 * @param args The message to log.
 * @returns Nothing.
 */
export function log(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.blue('⟦MARIKO LOG⟧'), chalk.blue(arg.message || arg));
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "test" tag.
 *
 * @param args The message to log.
 * @returns Nothing.
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
 *
 * @param args The message to log.
 * @returns Nothing.
 */
export function err(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.red('⟦MARIKO ERROR⟧'), chalk.red(arg.message || arg));
    if (arg.message) console.log(arg);
  });
}

/**
 * Logs a message to the console, with the "caught error" tag.
 *
 * @param args The message to log.
 * @returns Nothing.
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
 *
 * @param args The message to log.
 * @returns Nothing.
 */
export function clean(...args: any[]): void {
  args.forEach((arg: any): any => {
    console.log(chalk.grey('⟦MARIKO CLEAN⟧', arg.message || arg));
  });
}

/**
 * The equivalent of setTimeout, but asynchronous.
 *
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Nothing.
 */
export async function timeout(fn: (...args: any[]) => any, ms: number): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return fn(...arguments);
}

/**
 * A function that gets the User instance with the given id.
 *
 * @param client The client instance.
 * @param user The user id or username.
 * @returns The User instance.
 */
export async function IdToUser(client: SuperClient, user: Snowflake): Promise<User> {
  if (!client || !(client instanceof SuperClient)) throw new Error('Invalid client provided.');

  let userInstance: User | void = await client.users.fetch(user).catch(clean);
  if (!userInstance) {
    userInstance = client.users.cache.find((u: User): boolean => u.tag.startsWith(user));
  }
  return userInstance;
}

/**
 * A function that gets the Guild instance with the given id.
 *
 * @param client The client instance.
 * @param guild The guild id or username.
 * @returns The User instance.
 */
export async function IdToGuild(client: SuperClient, guild: Snowflake): Promise<Guild> {
  if (!client || !(client instanceof SuperClient)) throw new Error('Invalid client provided.');

  let guildInstance: Guild | void = await client.guilds.fetch(guild).catch(clean);
  if (!guildInstance) {
    guildInstance = client.guilds.cache.find((g: Guild): boolean => g.name.startsWith(guild));
  }
  return guildInstance;
}

/**
 * A function that gets the Channel instance with the given id.
 *
 * @param client The client instance.
 * @param guildId The guild id.
 * @param channelId The channel id or name.
 * @returns The Channel instance.
 */
export async function IdToCtxChannel(
  client: SuperClient,
  guildId: Snowflake,
  channelId: Snowflake,
): Promise<ContextChannel> {
  if (!client || !(client instanceof SuperClient)) throw new Error('Invalid client provided.');

  const guild: Guild | void = await client.guilds.fetch(guildId).catch(clean);
  if (!guild) return;

  let channelInstance: GuildBasedChannel = guild.channels.resolve(channelId);
  if (!channelInstance)
    channelInstance = guild.channels.cache.find((c: GuildBasedChannel): boolean => c.name.startsWith(channelId));

  return channelInstance as ContextChannel;
}

/**
 * Get a message embed content.
 *
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
 *
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
 *
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function cap(str: string): string {
  return str.split('')[0].toUpperCase() + str.split('').slice(1);
}

/**
 * Returns the current date for a Discord timestamp.
 *
 * @param date The date number.
 * @returns The string.
 */
export function discordDate(date: number = Date.now()): string {
  return (date / 1000).toFixed(0);
}
