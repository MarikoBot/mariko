"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../root/Util");
const data = {
    name: 'test',
    description: 'Commande de testing générale.',
    interferingCommands: ['test'],
    coolDown: 5000,
    uniqueUsers: ['539842701592494111', '822895842964799499'],
    forbiddenGuilds: ['922404341107798036'],
    execute: async (client, interaction, ctx) => {
        await ctx.reply('empty response').catch(Util_1.caught);
        await (0, Util_1.timeout)(() => null, 10000);
        return ctx.command.end();
    },
};
exports.default = data;