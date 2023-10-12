import { ApplicationCommandSubGroupData } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const data: ApplicationCommandSubGroupData = {
  name: 'blacklist',
  nameLocalizations: {
    fr: 'liste-noire',
  },
  description: 'Command for blacklisting.',
  descriptionLocalizations: {
    fr: 'Commande de blacklisting.',
  },
  type: ApplicationCommandOptionType['SubcommandGroup'],
  options: [],
};

export default data;
