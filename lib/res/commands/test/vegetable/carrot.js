"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'carrot',
    description: 'Miam, a carrot !',
    interferingCommands: ['test'],
    coolDown: 5,
    execute: async (client, interaction, ctx) => {
        await ctx.reply("🥕 I'm a carrot !{{ephemeral:false}}{{color:ORANGE}}").catch(Util_1.clean);
        await (0, Util_1.timeout)(() => null, 30000);
        return ctx.command.end();
    },
};
exports.default = data;
