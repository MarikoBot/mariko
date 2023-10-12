import { ApplicationCommandSubGroupData } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const data: ApplicationCommandSubGroupData = {
  name: 'cmdpriv',
  nameLocalizations: {
    fr: 'cmdpriv',
  },
  description: 'Command for setting command privileges.',
  descriptionLocalizations: {
    fr: 'Commande pour appliquer des privilèges de commande.',
  },
  type: ApplicationCommandOptionType['SubcommandGroup'],
  options: [],
};

export default data;
