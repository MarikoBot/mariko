"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'restrict',
    nameLocalizations: {
        fr: 'restreindre',
    },
    description: 'Restrict a command in a channel/role/user/guild only.',
    descriptionLocalizations: {
        fr: 'Restreint une commande pour un salon/rôle/utilisateur/serveur uniquement.',
    },
    interferingCommands: ['cmdpriv'],
    coolDown: 10,
    execute: async (client, interaction, ctx) => {
        await ctx.reply('cmdpriv forbid {{ephemeral::true}}{{color::DARK}}').catch(Util_1.clean);
        return ctx.command.end();
    },
};
exports.default = data;
