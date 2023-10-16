"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importing dotenv and configuring it
const dotenv = require("dotenv");
const chalk = require("chalk");
dotenv.config();
// Importing the client
const SuperClient_1 = require("./root/SuperClient");
// Creating a new instance of the client
const client = new SuperClient_1.default();
// Importing the database service and launch the client if the connection is successful.
const database_service_1 = require("./database.service");
const Util_1 = require("./root/Util");
(0, database_service_1.default)(client)
    .then(() => (0, Util_1.log)('Database connected'))
    .catch(Util_1.caught);
client.Events.bindEvent('ready');
client.Events.bindEvent('interactionCreate');
// Logging in the client
void client.login(process.env.TOKEN);
// Refreshes the blacklist cache.
setInterval(async () => {
    client.blacklist = (await client.Servers.Core.getCore()).blacklist;
}, 30000);
// Importing and managing the PM2 metrics.
const custom_metrics_1 = require("./custom.metrics");
setInterval(async () => {
    if (client.isReady())
        await (0, custom_metrics_1.default)(client);
}, 30000);
process.on('unhandledRejection', (reason, p) => {
    console.log(chalk.bgYellow.black('⟦UNHANDLED REJECTION⟧'), chalk.bgBlack.yellow(reason));
    console.log(p);
});
process.on('uncaughtException', (err, origin) => {
    console.log(chalk.bgYellow.black('⟦UNCAUGHT EXCEPTION⟧'), chalk.bgBlack.yellow(err));
    console.log(origin);
});
