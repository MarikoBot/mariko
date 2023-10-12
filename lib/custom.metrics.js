"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customMetrics = exports.realtimeUsers = exports.realtimeGuilds = exports.realtimePlayers = void 0;
const io = require("@pm2/io");
const discord_js_1 = require("discord.js");
const Util_1 = require("./root/Util");
/**
 * Realtime players amount.
 */
exports.realtimePlayers = io.metric({ name: 'Realtime players' });
/**
 * Realtime guilds amount.
 */
exports.realtimeGuilds = io.metric({ name: 'Realtime guilds' });
/**
 * Realtime users amount.
 */
exports.realtimeUsers = io.metric({ name: 'Realtime users' });
/**
 * Add useful metrics to the PM2 dashboard.
 *
 * @param players The number of players in the bot (RPG service).
 * @param guilds The number of guilds where the bot is on.
 * @param users The number of users who are able to use the bot.
 * @returns Nothing.
 */
function customMetrics(players, guilds, users) {
    exports.realtimePlayers.set(players);
    exports.realtimeGuilds.set(guilds);
    exports.realtimeUsers.set(users);
}
exports.customMetrics = customMetrics;
/**
 * Update the stats automatically with the client instance.
 *
 * @param client The client.
 * @returns Nothing.
 */
async function showMetrics(client) {
    const guilds = (await client.guilds.fetch().catch(Util_1.clean)) || new discord_js_1.Collection();
    const users = client.users.cache || new discord_js_1.Collection();
    const players = await client.Servers.Player.collectionData.Model.countDocuments().exec();
    customMetrics(players, guilds.size, users.size);
}
exports.default = showMetrics;
