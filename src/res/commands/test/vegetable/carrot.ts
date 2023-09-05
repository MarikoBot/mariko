// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../../../../root/Client';
import Context from '../../../../root/Context';
import { clean, timeout } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

const data: CommandType = {
  name: 'carrot',
  description: 'Miam, a carrot !',
  interferingCommands: ['test'],
  coolDown: 5,
  execute: async (client: Client, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply("🥕 I'm a carrot !{{ephemeral:false}}{{color:ORANGE}}").catch(clean);

    await timeout((): null => null, 30000);
    return ctx.command.end();
  },
};

export default data;
