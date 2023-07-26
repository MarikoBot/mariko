import { connect } from 'mongoose';
import Client from './root/Client';

/**
 * Connects to the database.
 * @param client The Client instance.
 * @returns Void.
 */
export default async function (client: Client): Promise<void> {
  await connect(process.env.DB_CONN_STRING as string, { dbName: 'main' });

  const currentData: {} = await client.Server.Core.find();
  if (!currentData) await client.Server.Core.create();
}
