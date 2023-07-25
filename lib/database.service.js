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
    const currentData = await client.Server.Core.find();
    if (!currentData)
        await client.Server.Core.create();
}
exports.default = default_1;
