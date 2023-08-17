import { LanguageContent } from '../LanguageManager';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering:
    "❌ Vous ne pouvez pas exécuter cette commande tant que les commandes [[]] sont en cours d'utilisation.{{color:YELLOW}}{{ephemeral:true}}",
  activeCoolDown:
    "⏳ Doucement ! La commande **/[[]]** ne peut pas être exécutée de nouveau, temps d'attente: <t:[[]]:R>{{color:YELLOW}}{{ephemeral:true}}",
  privilegesLocked:
    '🔑 Cette commande est verrouillée dans ce contexte.\n```diff\n- Code privilèges: [[]]```{{color:RED}}{{ephemeral:true}}',
} as const;

export default strings;
