// noinspection JSUnusedGlobalSymbols

import { ChatInputCommandInteraction } from 'discord.js';

import SuperClient from '../../../../root/SuperClient';
import Context from '../../../../root/Context';
import { clean } from '../../../../root/Util';
import { CommandType } from '../../../../root/Command';

const data: CommandType = {
  name: 'forbid',
  nameLocalizations: {
    fr: 'interdire',
  },
  description: 'Forbid a channel/role/user/guild from using a command.',
  descriptionLocalizations: {
    fr: "Interdit un salon/rôle/utilisateur/serveur d'utiliser une commande.",
  },
  interferingCommands: ['cmdpriv'],
  coolDown: 10,
  execute: async (client: SuperClient, interaction: ChatInputCommandInteraction, ctx: Context): Promise<void> => {
    await ctx.reply('cmdpriv forbid {{ephemeral::true}}{{color::DARK}}').catch(clean);

    return ctx.command.end();
  },
};

export default data;
