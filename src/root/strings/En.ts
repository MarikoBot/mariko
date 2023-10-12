import { LanguageContent } from '../LanguageManager';
import conf from '../../res/ClientConfig';
import shortcuts from './Shortcuts';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering: `❌ You can't execute this command while ${conf.varBrackets} are being used.${shortcuts.yellow}${shortcuts.ephemeral}`,
  activeCoolDown: `⏳ Chill ! The command **/${conf.varBrackets}** can't be executed right now, waiting time: <t:${conf.varBrackets}:R>.${shortcuts.yellow}${shortcuts.ephemeral}`,
  privilegesLocked: `🔑 This command is locked in this context.\n\`\`\`diff\n- Privileges code: ${conf.varBrackets}\`\`\`${shortcuts.red}${shortcuts.ephemeral}`,
} as const;

export default strings;
