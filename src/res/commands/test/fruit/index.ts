import { ApplicationCommandSubGroupData } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const data: ApplicationCommandSubGroupData = {
  name: 'fruit',
  description: 'Commande de testing de fruits.',
  type: ApplicationCommandOptionType.SubcommandGroup,
  options: [],
};

export default data;
