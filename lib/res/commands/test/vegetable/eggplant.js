"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'eggplant',
    description: 'Miam, an eggplant !',
    interferingCommands: ['test'],
    coolDown: 5,
    execute: async (client, interaction, ctx) => {
        await ctx.reply("🍆 I'm an eggplant !{{ephemeral:false}}{{color:PURPLE}}").catch(Util_1.caught);
        await (0, Util_1.timeout)(() => null, 30000);
        return ctx.command.end();
    },
};
exports.default = data;
