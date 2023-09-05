"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordDate = exports.cap = exports.Colors = exports.extractString = exports.Vowels = exports.readEmbeds = exports.SFToCtxChannel = exports.SFToUser = exports.SFToMember = exports.timeout = exports.clean = exports.caught = exports.err = exports.test = exports.log = void 0;
const discord_js_1 = require("discord.js");
const chalk = require("chalk");
/**
 * Logs a message to the console.
 * @param args The message to log.
 * @returns Void.
 */
function log(...args) {
    args.forEach((arg) => {
        console.log(chalk.blue('⟦MARIKO LOG⟧'), chalk.blue(arg.message || arg));
        if (arg.message)
            console.log(arg);
    });
}
exports.log = log;
/**
 * Logs a message to the console, with the "test" tag.
 * @param args The message to log.
 * @returns Void.
 */
function test(...args) {
    args.forEach((arg) => {
        console.log(chalk.magenta('⟦MARIKO TEST⟧'));
        console.log(arg.message || arg);
        if (arg.message)
            console.log(arg);
    });
}
exports.test = test;
/**
 * Logs a message to the console, with the "error" tag.
 * @param args The message to log.
 * @returns Void.
 */
function err(...args) {
    args.forEach((arg) => {
        console.log(chalk.red('⟦MARIKO ERROR⟧'), chalk.red(arg.message || arg));
        if (arg.message)
            console.log(arg);
    });
}
exports.err = err;
/**
 * Logs a message to the console, with the "caught error" tag.
 * @param args The message to log.
 * @returns Void.
 */
function caught(...args) {
    args.forEach((arg) => {
        console.log(chalk.magenta('⟦MARIKO ERROR⟧'));
        console.log(chalk.magenta(arg.message || arg));
        if (arg.message)
            console.log(arg);
    });
}
exports.caught = caught;
/**
 * Logs a message to the console, with the "clean error" tag.
 * @param args The message to log.
 * @returns Void.
 */
function clean(...args) {
    args.forEach((arg) => {
        console.log(chalk.green('⟦MARIKO ERROR⟧'));
        console.log(chalk.green(arg.message || arg));
    });
}
exports.clean = clean;
/**
 * The equivalent of setTimeout, but asynchronous.
 * @param fn The function to call.
 * @param ms The time to wait before calling the function.
 * @returns Void.
 */
async function timeout(fn, ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return fn(...arguments);
}
exports.timeout = timeout;
/**
 * A function that gets the GuildMember instance with the given ID.
 * @param client The client instance.
 * @param guildID The guild ID.
 * @param member The member ID or username.
 * @returns The GuildMember instance.
 */
async function SFToMember(client, guildID, member) {
    if (!client || !(client instanceof discord_js_1.Client))
        throw new Error('Invalid client provided.');
    const guild = await client.guilds.fetch(guildID);
    let memberInstance = guild.members.resolve(member);
    if (!memberInstance) {
        memberInstance = guild.members.cache.find((m) => m.user.tag.startsWith(member));
    }
    return memberInstance;
}
exports.SFToMember = SFToMember;
/**
 * A function that gets the User instance with the given ID.
 * @param client The client instance.
 * @param user The user ID or username.
 * @returns The User instance.
 */
async function SFToUser(client, user) {
    if (!client || !(client instanceof discord_js_1.Client))
        throw new Error('Invalid client provided.');
    let userInstance = client.users.resolve(user);
    if (!userInstance) {
        userInstance = client.users.cache.find((u) => u.tag.startsWith(user));
    }
    return userInstance;
}
exports.SFToUser = SFToUser;
/**
 * A function that gets the Channel instance with the given ID.
 * @param client The client instance.
 * @param guildID The guild ID.
 * @param channel The channel ID or name.
 * @returns The Channel instance.
 */
async function SFToCtxChannel(client, guildID, channel) {
    if (!client || !(client instanceof discord_js_1.Client))
        throw new Error('Invalid client provided.');
    const guild = await client.guilds.fetch(guildID);
    let channelInstance = guild.channels.resolve(channel);
    if (!channelInstance)
        channelInstance = guild.channels.cache.find((c) => c.name.startsWith(channel));
    return channelInstance;
}
exports.SFToCtxChannel = SFToCtxChannel;
/**
 * Get a message embed content.
 * @param message The message to read.
 * @returns The message content.
 */
function readEmbeds(message) {
    return message.embeds
        .map((value) => `${value.title || ''} - ${value.description || ''}`)
        .reduce((previousValue, currentValue) => `${previousValue} - ${currentValue}`);
}
exports.readEmbeds = readEmbeds;
/**
 * The vowels of the alphabet.
 */
exports.Vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
/**
 * Extract the data from a string, applying a regular expression to match the data.
 * @param regexp The RegExp to match on.
 * @param str The string to test on.
 * @returns The matching value.
 */
function extractString(regexp, str) {
    const matches = str.match(regexp);
    if (matches && matches.length > 1)
        return matches[1];
    return null;
}
exports.extractString = extractString;
/**
 * The Colors enum. These are the colors used in the embeds.
 */
exports.Colors = {
    RED: 0xff4848,
    ORANGE: 0xff7526,
    YELLOW: 0xffec80,
    GREEN: 0x36ff6d,
    BLUE: 0x454bff,
    PURPLE: 0xc167ff,
    WHITE: 0xebebeb,
    DARK: 0x2c2d31,
};
/**
 * Capitalize the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
function cap(str) {
    return str.split('')[0].toUpperCase() + str.split('').slice(1);
}
exports.cap = cap;
/**
 * Returns the current date for a Discord timestamp.
 * @param date The date number.
 * @returns The string.
 */
function discordDate(date = Date.now()) {
    return (date / 1000).toFixed(0);
}
exports.discordDate = discordDate;
