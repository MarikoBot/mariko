// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import SuperClient from '../../../../root/SuperClient';
import Context from '../../../../root/Context';
import { CommandType } from '../../../../root/Command';
import Blacklist from '../../../../service/adminPanel/Blacklisting';

const data: CommandType = {
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
  execute: async (client: SuperClient, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    const blacklistPanel: Blacklist = (await client.Services.AdminPanel(client, ctx.channel.guild.id, ctx.channel.id))
      .blacklisting;
    await blacklistPanel.handlePagination(interaction);

    return ctx.command.end();
  },
};

export default data;
