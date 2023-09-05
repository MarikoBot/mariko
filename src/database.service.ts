import { connect } from 'mongoose';
import Client from './root/Client';
import * as models from './models/index';
import { CommandPrivileges } from './models/Core';

/**
 * An interface that includes an added value.
 */
interface TransformedData extends models.Core.Interface {
  /**
   * If the data of the core were empty.
   */
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

  const commandsPrivileges: Record<string, CommandPrivileges> = {
    'test fruit banana': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
    'test fruit cherry': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
    'test vegetable eggplant': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
    'test vegetable carrot': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
  };

  const cmdPrivileges: Record<string, CommandPrivileges> = currentData.commandPrivileges || {};
  for (const commandName of Object.keys(commandsPrivileges)) {
    const currentCommandPrivileges: CommandPrivileges = cmdPrivileges?.[commandName];
    if (currentCommandPrivileges !== commandsPrivileges[commandName]) {
      cmdPrivileges[commandName] = commandsPrivileges[commandName];
    }
  }

  await client.Server.User.createUser('539842701592494111', 'en');

  delete currentData.__empty;
  currentData.commandPrivileges = cmdPrivileges;
  await client.Server.Core.updateCore(currentData);
}
