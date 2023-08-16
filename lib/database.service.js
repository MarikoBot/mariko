"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Connects to the database.
 * @param client The Client instance.
 * @returns Void.
 */
async function default_1(client) {
    await (0, mongoose_1.connect)(process.env.DB_CONN_STRING, { dbName: 'main' });
    let currentData = (await client.Server.Core.getCore());
    if (!currentData)
        currentData = { __empty: true };
    else
        currentData.__empty = false;
    if (currentData.__empty)
        await client.Server.Core.createCore();
    currentData = (await client.Server.Core.getCore());
    const commandsPrivileges = {
        'test fruit banana': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test fruit cherry': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test vegetable eggplant': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
        'test vegetable carrot': { uniqueChannels: ['1139207781900099594', '1139214709061591201'] },
    };
    const cmdPrivs = currentData.commandPrivileges || {};
    for (const commandName of Object.keys(commandsPrivileges)) {
        const currentCommandPrivileges = cmdPrivs?.[commandName];
        if (currentCommandPrivileges !== commandsPrivileges[commandName]) {
            cmdPrivs[commandName] = commandsPrivileges[commandName];
        }
    }
    delete currentData.__empty;
    currentData.commandPrivileges = cmdPrivs;
    await client.Server.Core.updateCore(currentData);
}
exports.default = default_1;
