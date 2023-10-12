"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_1 = require("../../res/ClientConfig");
const Shortcuts_1 = require("./Shortcuts");
/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings = {
    activeInterfering: `❌ Vous ne pouvez pas exécuter cette commande tant que les commandes ${ClientConfig_1.default.varBrackets} sont en cours d'utilisation.${Shortcuts_1.default.yellow}${Shortcuts_1.default.ephemeral}`,
    activeCoolDown: `⏳ Doucement ! La commande **/${ClientConfig_1.default.varBrackets}** ne peut pas être exécutée de nouveau, temps d'attente: <t:${ClientConfig_1.default.varBrackets}:R>.${Shortcuts_1.default.yellow}${Shortcuts_1.default.ephemeral}`,
    privilegesLocked: `🔑 Cette commande est verrouillée dans ce contexte.\n\`\`\`diff\n- Code privilèges: ${ClientConfig_1.default.varBrackets}\`\`\`${Shortcuts_1.default.red}${Shortcuts_1.default.ephemeral}`,
};
exports.default = strings;
