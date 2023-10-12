import * as io from '@pm2/io';
import Gauge from '@pm2/io/build/main/utils/metrics/gauge';
import Client from './root/Client';
import { Collection, Guild, OAuth2Guild, User } from 'discord.js';
import { clean } from './root/Util';

/**
 * Realtime players amount.
 */
export const realtimePlayers: Gauge = io.metric({ name: 'Realtime players' });

/**
 * Realtime guilds amount.
 */
export const realtimeGuilds: Gauge = io.metric({ name: 'Realtime guilds' });

/**
 * Realtime users amount.
 */
export const realtimeUsers: Gauge = io.metric({ name: 'Realtime users' });

/**
 * Add useful metrics to the PM2 dashboard.
 *
 * @param players The number of players in the bot (RPG service).
 * @param guilds The number of guilds where the bot is on.
 * @param users The number of users who are able to use the bot.
 * @returns Nothing.
 */
export function customMetrics(players: number, guilds: number, users: number): void {
  realtimePlayers.set(players);
  realtimeGuilds.set(guilds);
  realtimeUsers.set(users);
}

/**
 * Update the stats automatically with the client instance.
 *
 * @param client The client.
 * @returns Nothing.
 */
export default async function showMetrics(client: Client): Promise<void> {
  const guilds: Collection<string, Guild | OAuth2Guild> =
    (await client.guilds.fetch().catch(clean)) || new Collection();
  const users: Collection<string, User> = client.users.cache || new Collection();
  const players: number = await client.Servers.Player.collectionData.Model.countDocuments().exec();

  customMetrics(players, guilds.size, users.size);
}
