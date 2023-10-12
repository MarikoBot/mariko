"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/*
  The default data for the client.
 */
var ClientConfig;
(function (ClientConfig) {
    /**
     * The opening brackets for variables in strings.
     */
    ClientConfig.varBracketsOpen = '[[';
    /**
     * The closing brackets for variables in strings.
     */
    ClientConfig.varBracketsClose = ']]';
    /**
     * The brackets for variables in strings.
     */
    ClientConfig.varBrackets = ClientConfig.varBracketsOpen + ClientConfig.varBracketsClose;
    /**
     * The opening brackets for extracted data.
     */
    ClientConfig.extBracketsOpen = '{{';
    /**
     * The closing brackets for extracted data.
     */
    ClientConfig.extBracketsClose = '}}';
    /**
     * The brackets for extracted data.
     */
    ClientConfig.extBrackets = ClientConfig.extBracketsOpen + ClientConfig.extBracketsClose;
    /**
     * The splitter for extracted data.
     */
    ClientConfig.extSplitter = '::';
    /**
     * The default client id.
     */
    ClientConfig.defaultClientId = '1146155436496670820';
    /**
     * Intents to enable for this connection.
     */
    ClientConfig.intents = 3276799;
    /**
     * The default value for MessageReplyOptions#failIfNotExists.
     */
    ClientConfig.failIfNotExists = false;
    /**
     * Presence data to use upon login.
     */
    ClientConfig.presence = {
        status: 'online',
        activities: [
            {
                name: `with version ${require('../../package.json').version}`,
                type: discord_js_1.ActivityType['Playing'],
            },
        ],
    };
    /**
     * The directory to load the commands from.
     */
    ClientConfig.commandsDir = 'Res/Commands';
    /**
     * Whether the client should load commands or not. Load commands means sending commands to the API.
     * Don't activate this permanently, it's only on change.
     */
    ClientConfig.loadCommands = true;
    /**
     * Represents the default timeout for any message component interaction.
     */
    ClientConfig.defaultComponentTimeout = 120000;
    /**
     * Represents the default timeout for modal component interaction.
     */
    ClientConfig.defaultModalTimeout = 300000;
    /**
     * The regular expression for username input.
     */
    ClientConfig.usernameRegexp = /^[a-zA-Z0-9éèàçùòñõâêîôû'."]+(?:\s[a-zA-Z0-9]+)*$/gs;
    /**
     * Commands list regular expression.
     */
    ClientConfig.commandsListRegexp = /^[a-z]+(?: [a-z]+)*(?:, [a-z]+(?: [a-z]+)*)*$/gm;
    /**
     * Numbers regular expression.
     */
    ClientConfig.numbersRegexp = /[0-9]+/gm;
    /**
     * The list of Ids regular expression.
     */
    ClientConfig.idsListRegexp = /^[0-9]{18,21}(?: [0-9]{18,21})*(?:, [0-9]{18,21}(?: [0-9]{18,21})*)*$/gm;
    /**
     * The list of the owners of the bot.
     */
    ClientConfig.owners = ['539842701592494111', '1146145475683164273'];
    /**
     * The support guild id.
     */
    ClientConfig.supportGuildId = '1113177643710423060';
    /**
     * The roles for the support.
     */
    ClientConfig.supportRoles = {
        /**
         * The manager one.
         */
        manager: '1141396826084356096',
        /**
         * The moderator one.
         */
        mod: '1138785200541806592',
        /**
         * The helper one.
         */
        helper: '1138785004852367402',
    };
})(ClientConfig || (ClientConfig = {}));
exports.default = ClientConfig;
