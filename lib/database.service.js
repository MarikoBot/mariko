"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Connects to the database.
 *
 * @param client The Client instance.
 * @returns Nothing.
 */
async function default_1(client) {
    await (0, mongoose_1.connect)(process.env.DB_CONN_STRING, { dbName: 'main' });
    let currentData = (await client.Servers.Core.getCore());
    if (!currentData)
        currentData = { __empty: true };
    else
        currentData.__empty = false;
    if (currentData.__empty)
        await client.Servers.Core.createCore();
    currentData = (await client.Servers.Core.getCore());
    const commandsPrivileges = {
        'test fruit banana': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test fruit cherry': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test vegetable eggplant': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test vegetable carrot': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
    };
    const cmdPrivileges = currentData.commandPrivileges || {};
    for (const commandName of Object.keys(commandsPrivileges)) {
        const currentCommandPrivileges = cmdPrivileges?.[commandName];
        if (currentCommandPrivileges !== commandsPrivileges[commandName]) {
            cmdPrivileges[commandName] = commandsPrivileges[commandName];
        }
    }
    await client.Servers.User.createUser('539842701592494111', 'en');
    delete currentData.__empty;
    currentData.commandPrivileges = cmdPrivileges;
    await client.Servers.Core.updateCore(currentData);
}
exports.default = default_1;
