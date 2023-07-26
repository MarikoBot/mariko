// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction, InteractionResponse, Message } from 'discord.js';

import { CommandType } from '../../root/Command';
import Client from '../../root/Client';
import Context from '../../root/Context';
import { caught, timeout } from '../../root/Util';

const data: CommandType = {
  name: 'test',
  description: 'Commande de testing générale.',
  interferingCommands: ['test'],
  coolDown: 5000,
  uniqueUsers: ['539842701592494111', '822895842964799499'],
  execute: async (client: Client, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply('667 Ekip Grr paw{{ephemeral:false}}').catch(caught);
    await timeout((): null => null, 10000);
    return ctx.command.end();
  },
};

export default data;
