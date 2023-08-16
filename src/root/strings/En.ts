import { LanguageContent } from '../LanguageManager';

/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings: LanguageContent = {
  activeInterfering: "❌ You can't execute this command while [[]] are being used.{{color:YELLOW}}{{ephemeral:true}}",
  activeCoolDown:
    "⏳ Chill ! The command **/[[]]** can't be executed right now, waiting time: <t:[[]]:R>{{color:YELLOW}}{{ephemeral:true}}",
  forbiddenChannel: '❌ This command is disabled in this channel.{{color:RED}}{{ephemeral:true}}',
  forbiddenUser: '❌ This command is disabled for this user.{{color:RED}}{{ephemeral:true}}',
  forbiddenRole: '❌ This command is disabled for this role.{{color:RED}}{{ephemeral:true}}',
  forbiddenGuild: '❌ This command is disabled for this guild.{{color:RED}}{{ephemeral:true}}',
  uniqueChannel: "🔒 This command isn't accessible in this channel.{{color:RED}}{{ephemeral:true}}",
  uniqueUser: "🔒 This command isn't accessible for this user.{{color:RED}}{{ephemeral:true}}",
  uniqueRole: "🔒 This command isn't accessible for this role.{{color:RED}}{{ephemeral:true}}",
  uniqueGuild: "🔒 This command isn't accessible for this guild.{{color:RED}}{{ephemeral:true}}",
} as const;

export default strings;
