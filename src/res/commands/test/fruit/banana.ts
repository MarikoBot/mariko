// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../../../../root/Client';
import Context from '../../../../root/Context';
import { caught, timeout } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

const data: CommandType = {
  name: 'banana',
  description: 'Miam, a banana !',
  interferingCommands: ['test'],
  coolDown: 5,
  uniqueUsers: ['539842701592494111', '822895842964799499', '583697022545297408'],
  execute: async (client: Client, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply("🍌 I'm a banana !{{ephemeral:false}}{{color:YELLOW}}").catch(caught);

    await timeout((): null => null, 30000);
    return ctx.command.end();
  },
};

export default data;
