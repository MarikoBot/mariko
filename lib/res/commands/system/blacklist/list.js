"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const data = {
    name: 'list',
    nameLocalizations: {
        fr: 'lister',
    },
    description: 'List elements of the blacklist.',
    descriptionLocalizations: {
        fr: 'Liste les éléments de la blacklist.',
    },
    interferingCommands: ['blacklist'],
    coolDown: 10,
    execute: async (client, interaction, ctx) => {
        const blacklistPanel = (await client.Services.AdminPanel(client, ctx.channel.id, ctx.channel.guild.id))
            .blacklisting;
        await blacklistPanel.handlePagination(interaction);
        return ctx.command.end();
    },
};
exports.default = data;
