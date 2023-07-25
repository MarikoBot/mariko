// Importing dotenv and configuring it
import * as dotenv from 'dotenv';
import * as chalk from 'chalk';
dotenv.config();

// Importing the client
import Client from './root/Client';

// Creating a new instance of the client
const client: Client = new Client();

// Importing the database service and launch the client if the connection is successful.
import dbservice from './database.service';
import { caught, log } from './root/Util';
dbservice(client)
  .then(() => log('Database connected'))
  .catch(caught);

client.Events.bindEvent('ready');
client.Events.bindEvent('interactionCreate');

// Logging in the client
void client.login(process.env.TOKEN);

process.on('unhandledRejection', (reason, p: Promise<any>): void => {
  console.log(chalk.bgYellow.black('⟦UNHANDLED REJECTION⟧'), chalk.bgBlack.yellow(reason));
  console.log(p);
});

process.on('uncaughtException', (err: Error, origin: NodeJS.UncaughtExceptionOrigin): void => {
  console.log(chalk.bgYellow.black('⟦UNCAUGHT EXCEPTION⟧'), chalk.bgBlack.yellow(err));
  console.log(origin);
});