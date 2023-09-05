import { ChatInputCommandInteraction } from 'discord.js';

import Client from '../../../../root/Client';
import Context from '../../../../root/Context';
import { clean, timeout } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

const data: CommandType = {
  name: 'cherry',
  description: 'Miam, a cherry !',
  interferingCommands: ['test'],
  coolDown: 5,
  execute: async (client: Client, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply("🍒 I'm a cherry !{{ephemeral:false}}{{color:RED}}").catch(clean);

    await timeout((): null => null, 30000);
    return ctx.command.end();
  },
};

export default data;
