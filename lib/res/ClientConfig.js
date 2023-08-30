"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/*
  The default data for the client.
 */
const defaultData = {
    /**
     * The brackets for variables in strings.
     */
    varBracketsOpen: '[[',
    /**
     * The brackets for variables in strings.
     */
    varBracketsClose: ']]',
    /**
     * The brackets for extracted data.
     */
    extBracketsOpen: '{{',
    /**
     * The brackets for extracted data.
     */
    extBracketsClose: '}}',
    /**
     * The default client id.
     */
    defaultClientId: '1146155436496670820',
    /**
     * Intents to enable for this connection.
     */
    intents: 3276799,
    /**
     * The default value for MessageReplyOptions#failIfNotExists.
     */
    failIfNotExists: false,
    /**
     * Presence data to use upon login.
     */
    presence: {
        status: 'dnd',
        activities: [
            {
                name: '& Monitoring',
                type: discord_js_1.ActivityType.Watching,
            },
        ],
    },
    /**
     * The directory to load the commands from.
     */
    commandsDir: 'Res/Commands',
    /**
     * Whether the client should load commands or not. Load commands means sending commands to the API.
     * Don't activate this permanently, it's only on change.
     */
    loadCommands: true,
    /**
     * Represents the default timeout for any message component interaction.
     */
    defaultComponentTimeout: 120000,
    /**
     * Represents the default timeout for modal component interaction.
     */
    defaultModalTimeout: 300000,
    /**
     * The regular expression for username input.
     */
    usernameRegexp: /^[a-zA-Z0-9éèàçùòñõâêîôû'."]+(?:\s[a-zA-Z0-9]+)*$/gs,
    /**
     * The list of the three owners of the bot.
     */
    owners: ['539842701592494111', '822895842964799499', '583697022545297408'],
};
exports.default = defaultData;
