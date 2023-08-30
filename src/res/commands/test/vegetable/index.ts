import { ApplicationCommandSubGroupData } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

const data: ApplicationCommandSubGroupData = {
  name: 'vegetable',
  description: 'Commande de testing de légumes.',
  type: ApplicationCommandOptionType.SubcommandGroup,
  options: [],
};

export default data;
