"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v10_1 = require("discord-api-types/v10");
const data = {
    name: 'cmdpriv',
    nameLocalizations: {
        fr: 'cmdpriv',
    },
    description: 'Command for setting command privileges.',
    descriptionLocalizations: {
        fr: 'Commande pour appliquer des privilèges de commande.',
    },
    type: v10_1.ApplicationCommandOptionType['SubcommandGroup'],
    options: [],
};
exports.default = data;
