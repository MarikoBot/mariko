// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import SuperClient from '../../../../root/SuperClient';
import Context from '../../../../root/Context';
import { CommandType } from '../../../../root/Command';
import Blacklist from '../../../../service/adminPanel/Blacklisting';

const data: CommandType = {
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
  execute: async (client: SuperClient, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    const blacklistPanel: Blacklist = (await client.Services.AdminPanel(client, ctx.channel.guild.id, ctx.channel.id))
      .blacklisting;
    await blacklistPanel.displayRemoveModal(interaction);

    return ctx.command.end();
  },
};

export default data;
