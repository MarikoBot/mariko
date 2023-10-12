"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../../../root/Util");
const data = {
    name: 'forbid',
    nameLocalizations: {
        fr: 'interdire',
    },
    description: 'Forbid a channel/role/user/guild from using a command.',
    descriptionLocalizations: {
        fr: "Interdit un salon/rôle/utilisateur/serveur d'utiliser une commande.",
    },
    interferingCommands: ['cmdpriv'],
    coolDown: 10,
    execute: async (client, interaction, ctx) => {
        await ctx.reply('cmdpriv forbid {{ephemeral::true}}{{color::DARK}}').catch(Util_1.clean);
        return ctx.command.end();
    },
};
exports.default = data;
