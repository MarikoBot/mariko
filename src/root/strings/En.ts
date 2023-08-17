import { LanguageContent } from '../LanguageManager';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering: "❌ You can't execute this command while [[]] are being used.{{color:YELLOW}}{{ephemeral:true}}",
  activeCoolDown:
    "⏳ Chill ! The command **/[[]]** can't be executed right now, waiting time: <t:[[]]:R>{{color:YELLOW}}{{ephemeral:true}}",
  privilegesLocked:
    '🔑 This command is locked in this context.\n```diff\n- Privileges code: [[]]```{{color:RED}}{{ephemeral:true}}',
} as const;

export default strings;
