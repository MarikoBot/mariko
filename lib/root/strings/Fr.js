"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Pack of all the strings used in important parts of the bot code.
 */
const strings = {
    activeInterfering: "❌ Vous ne pouvez pas exécuter cette commande tant que les commandes {{}} sont en cours d'utilisation.{{color:YELLOW}}",
    activeCoolDown: "⏳ Doucement! La commande **/{{}}** ne peut pas être exécutée de nouveau, temps d'attente: <t:{{}}:R>{{color:YELLOW}}",
    forbiddenChannel: '❌ Cette commande est désactivée dans ce salon.{{color:RED}}',
    forbiddenUser: '❌ Cette commande est désactivée pour cet utilisateur.{{color:RED}}',
    forbiddenRole: '❌ Cette commande est désactivée pour ce rôle.{{color:RED}}',
    forbiddenGuild: '❌ Cette commande est désactivée pour ce serveur.{{color:RED}}',
    uniqueChannel: "🔒 Cette commande n'est pas accessible dans ce salon.{{color:RED}}",
    uniqueUser: "🔒 Cette commande n'est pas accessible pour cet utilisateur.{{color:RED}}",
    uniqueRole: "🔒 Cette commande n'est pas accessible pour ce rôle.{{color:RED}}",
    uniqueGuild: "🔒 Cette commande n'est pas accessible pour ce serveur.{{color:RED}}",
};
exports.default = strings;
