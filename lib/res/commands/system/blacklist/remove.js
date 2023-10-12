"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'remove',
    nameLocalizations: {
        fr: 'supprimer',
    },
    description: 'Remove an element from the blacklist.',
    descriptionLocalizations: {
        fr: 'Supprime un élément de la blacklist.',
    },
    interferingCommands: ['blacklist'],
    coolDown: 10,
    execute: async (client, interaction, ctx) => {
        await ctx.reply('blacklist remove {{ephemeral::true}}{{color::DARK}}').catch(Util_1.clean);
        return ctx.command.end();
    },
};
exports.default = data;
