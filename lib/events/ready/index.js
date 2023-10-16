"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../../root/Util");
const post_exec_1 = require("../../post.exec");
/**
 * The function for the ready event.
 *
 * @param client The client instance.
 * @returns Nothing.
 */
async function ready(client) {
    (0, Util_1.log)(`Logged in as ${client.user.tag}.`);
    await (await client.Services.AdminPanel(client, '1113177643710423060', '1139950254322626751')).monitoring.refreshChannel();
    await client.supportGuild.refreshSupport();
    client.blacklist = (await client.Servers.Core.getCore()).blacklist;
    void (0, post_exec_1.default)(client);
}
exports.default = ready;
