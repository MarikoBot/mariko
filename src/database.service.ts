import { connect } from 'mongoose';
import Client from './root/Client';
import * as models from './models/index';
import { CommandPrivileges } from './models/Core';

interface TransformedData extends models.Core.Interface {
  __empty?: boolean;
}

/**
 * Connects to the database.
 * @param client The Client instance.
 * @returns Void.
 */
export default async function (client: Client): Promise<void> {
  await connect(process.env.DB_CONN_STRING as string, { dbName: 'main' });

  let currentData: TransformedData | { __empty: boolean } =
    (await client.Server.Core.getCore()) as models.Core.Interface;
  if (!currentData) currentData = { __empty: true };
  else currentData.__empty = false;

  if (currentData.__empty) await client.Server.Core.createCore();
  currentData = (await client.Server.Core.getCore()) as models.Core.Interface;

  const commandsPrivileges: Record<string, CommandPrivileges> = {};

  const cmdPrivs: Record<string, CommandPrivileges> = currentData.commandPrivileges || {};
  for (const commandName of Object.keys(commandsPrivileges)) {
    const currentCommandPrivileges: CommandPrivileges = cmdPrivs?.[commandName];
    if (currentCommandPrivileges !== commandsPrivileges[commandName]) {
      cmdPrivs[commandName] = commandsPrivileges[commandName];
    }
  }

  delete currentData.__empty;
  currentData.commandPrivileges = cmdPrivs;
  await client.Server.Core.updateCore(currentData);
}
