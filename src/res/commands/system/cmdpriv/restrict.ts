// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import SuperClient from '../../../../root/SuperClient';
import Context from '../../../../root/Context';
import { clean } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

const data: CommandType = {
  name: 'restrict',
  nameLocalizations: {
    fr: 'restreindre',
  },
  description: 'Restrict a command in a channel/role/user/guild only.',
  descriptionLocalizations: {
    fr: 'Restreint une commande pour un salon/rôle/utilisateur/serveur uniquement.',
  },
  interferingCommands: ['cmdpriv'],
  coolDown: 10,
  execute: async (client: SuperClient, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply('cmdpriv forbid {{ephemeral::true}}{{color::DARK}}').catch(clean);

    return ctx.command.end();
  },
};

export default data;
