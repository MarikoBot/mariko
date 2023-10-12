"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v10_1 = require("discord-api-types/v10");
const data = {
    name: 'blacklist',
    nameLocalizations: {
        fr: 'liste-noire',
    },
    description: 'Command for blacklisting.',
    descriptionLocalizations: {
        fr: 'Commande de blacklisting.',
    },
    type: v10_1.ApplicationCommandOptionType['SubcommandGroup'],
    options: [],
};
exports.default = data;
