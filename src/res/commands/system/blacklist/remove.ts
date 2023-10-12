// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../../../../root/Client';
import Context from '../../../../root/Context';
import { clean } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

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
  execute: async (client: Client, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply('blacklist remove {{ephemeral::true}}{{color::DARK}}').catch(clean);

    return ctx.command.end();
  },
};

export default data;
