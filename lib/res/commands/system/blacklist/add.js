"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const data = {
    name: 'add',
    nameLocalizations: {
        fr: 'ajouter',
    },
    description: 'Add an element to the blacklist.',
    descriptionLocalizations: {
        fr: 'Ajoute un élément à la blacklist.',
    },
    interferingCommands: ['blacklist'],
    coolDown: 10,
    execute: async (client, interaction, ctx) => {
        const blacklistPanel = (await client.Services.AdminPanel(client, ctx.channel.id, ctx.channel.guild.id))
            .blacklisting;
        await blacklistPanel.displayAddModal(interaction);
        return ctx.command.end();
    },
};
exports.default = data;
