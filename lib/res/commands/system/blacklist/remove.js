"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
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
        const blacklistPanel = (await client.Services.AdminPanel(client, ctx.channel.guild.id, ctx.channel.id))
            .blacklisting;
        await blacklistPanel.displayRemoveModal(interaction);
        return ctx.command.end();
    },
};
exports.default = data;
