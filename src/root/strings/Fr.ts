import { LanguageContent } from '../LanguageManager';
import conf from '../../res/ClientConfig';
import shortcuts from './Shortcuts';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering: `❌ Vous ne pouvez pas exécuter cette commande tant que les commandes ${conf.varBrackets} sont en cours d'utilisation.${shortcuts.yellow}${shortcuts.ephemeral}`,
  activeCoolDown: `⏳ Doucement ! La commande **/${conf.varBrackets}** ne peut pas être exécutée de nouveau, temps d'attente: <t:${conf.varBrackets}:R>.${shortcuts.yellow}${shortcuts.ephemeral}`,
  privilegesLocked: `🔑 Cette commande est verrouillée dans ce contexte.\n\`\`\`diff\n- Code privilèges: ${conf.varBrackets}\`\`\`${shortcuts.red}${shortcuts.ephemeral}`,
} as const;

export default strings;
