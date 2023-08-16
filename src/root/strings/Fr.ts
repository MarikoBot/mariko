import { LanguageContent } from '../LanguageManager';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering:
    "❌ Vous ne pouvez pas exécuter cette commande tant que les commandes [[]] sont en cours d'utilisation.{{color:YELLOW}}{{ephemeral:true}}",
  activeCoolDown:
    "⏳ Doucement ! La commande **/[[]]** ne peut pas être exécutée de nouveau, temps d'attente: <t:[[]]:R>{{color:YELLOW}}{{ephemeral:true}}",
  forbiddenChannel: '❌ Cette commande est désactivée dans ce salon.{{color:RED}}{{ephemeral:true}}',
  forbiddenUser: '❌ Cette commande est désactivée pour cet utilisateur.{{color:RED}}{{ephemeral:true}}',
  forbiddenRole: '❌ Cette commande est désactivée pour ce rôle.{{color:RED}}{{ephemeral:true}}',
  forbiddenGuild: '❌ Cette commande est désactivée pour ce serveur.{{color:RED}}{{ephemeral:true}}',
  uniqueChannel: "🔒 Cette commande n'est pas accessible dans ce salon.{{color:RED}}{{ephemeral:true}}",
  uniqueUser: "🔒 Cette commande n'est pas accessible pour cet utilisateur.{{color:RED}}{{ephemeral:true}}",
  uniqueRole: "🔒 Cette commande n'est pas accessible pour ce rôle.{{color:RED}}{{ephemeral:true}}",
  uniqueGuild: "🔒 Cette commande n'est pas accessible pour ce serveur.{{color:RED}}{{ephemeral:true}}",
} as const;

export default strings;
