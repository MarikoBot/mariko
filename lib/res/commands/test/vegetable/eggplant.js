"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'eggplant',
    description: 'Miam, an eggplant !',
    interferingCommands: ['test'],
    coolDown: 5,
    uniqueUsers: ['539842701592494111', '822895842964799499', '583697022545297408'],
    execute: async (client, interaction, ctx) => {
        await ctx.reply("🍆 I'm an eggplant !{{ephemeral:false}}{{color:PURPLE}}").catch(Util_1.caught);
        await (0, Util_1.timeout)(() => null, 10000);
        return ctx.command.end();
    },
};
exports.default = data;
