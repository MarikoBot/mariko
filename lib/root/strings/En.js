"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_1 = require("../../res/ClientConfig");
const Shortcuts_1 = require("./Shortcuts");
/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings = {
    activeInterfering: `❌ You can't execute this command while ${ClientConfig_1.default.varBrackets} are being used.${Shortcuts_1.default.yellow}${Shortcuts_1.default.ephemeral}`,
    activeCoolDown: `⏳ Chill ! The command **/${ClientConfig_1.default.varBrackets}** can't be executed right now, waiting time: <t:${ClientConfig_1.default.varBrackets}:R>.${Shortcuts_1.default.yellow}${Shortcuts_1.default.ephemeral}`,
    privilegesLocked: `🔑 This command is locked in this context.\n\`\`\`diff\n- Privileges code: ${ClientConfig_1.default.varBrackets}\`\`\`${Shortcuts_1.default.red}${Shortcuts_1.default.ephemeral}`,
};
exports.default = strings;
