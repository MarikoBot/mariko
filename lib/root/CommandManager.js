"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Command_1 = require("./Command");
const CoolDownManager_1 = require("./CoolDownManager");
const InterferingManager_1 = require("./InterferingManager");
/**
 * Represents the command manager of the client.
 */
class CommandManager {
    /**
     * The client instance.
     */
    client;
    /**
     * The cool down manager instance, to have access to the different delays of the current commands.
     */
    CoolDowns;
    /**
     * The interfering manager instance, to have access to the different executing commands.
     */
    Interfering;
    /**
     * The collection of the commands.
     */
    commandsList = new discord_js_1.Collection();
    /**
     * The list including all the fullNames of each command.
     */
    fullNameCommandsList = [];
    /**
     * The constructor of the command manager.
     *
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
        this.CoolDowns = new CoolDownManager_1.default(this.client);
        this.Interfering = new InterferingManager_1.default(this.client);
    }
    /**
     * Create a command based on the name and/or some options, and returns it.
     *
     * @param data The name and/or the options.
     * @returns The command instance.
     */
    create(data) {
        if (typeof data === 'string') {
            data = {
                name: data,
                description: 'No description provided.',
                execute: async () => {
                    void setTimeout(() => null);
                },
            };
        }
        if (!data.type)
            data.type = 1;
        const desc = data?.description;
        if (!desc) {
            data.description = 'No description provided.';
        }
        return new Command_1.default(this.client, data);
    }
    /**
     * Add a command to the client (the bot) using the name, options or the command itself.
     * If no command is passed, the function creates one based on the data passed.
     *
     * @param commandData The options passed (name, command options, command instance).
     * @returns The command manager instance (this).
     */
    add(commandData) {
        if (commandData instanceof Command_1.default) {
            this.commandsList.set(commandData.data.name, commandData);
            return this;
        }
        const command = this.create(commandData);
        this.commandsList.set(command.data.name, command);
        return this;
    }
    /**
     * Generates the fullName list.
     *
     * @returns The list.
     */
    generateFullList() {
        let commandNames = [];
        for (const command of this.commandsList.map((e) => e)) {
            commandNames.push(command.data.name);
            for (const opt of command.data.options) {
                if (opt.type === v10_1.ApplicationCommandOptionType['Subcommand'])
                    commandNames.push(`${command.data.name} ${opt.name}`);
                if (opt.type === v10_1.ApplicationCommandOptionType['SubcommandGroup']) {
                    const groupNames = [];
                    for (const sub of opt.options) {
                        groupNames.push(`${command.data.name} ${opt.name} ${sub.name}`);
                    }
                    commandNames = commandNames.concat(groupNames);
                }
            }
        }
        this.fullNameCommandsList = commandNames;
        return this.fullNameCommandsList;
    }
    /**
     * Get a command from the cache with the name.
     *
     * @param interaction The interaction.
     * @returns The found command instance, or undefined.
     */
    getCommand(interaction) {
        let command = this.commandsList.get(interaction.commandName);
        const commandName = command.data.name;
        let subName = '';
        let groupName = '';
        let optionsData = interaction.options.data;
        const thereIsGroup = optionsData.filter((elt) => elt.type === v10_1.ApplicationCommandOptionType['SubcommandGroup']);
        if (thereIsGroup.length > 0) {
            const group = command.data.options.filter((opt) => opt.name === thereIsGroup[0].name)[0];
            groupName = group.name;
            command = this.create(group);
            optionsData = thereIsGroup[0].options;
        }
        const thereIsSub = optionsData.filter((elt) => elt.type === v10_1.ApplicationCommandOptionType['Subcommand']);
        if (thereIsSub.length > 0) {
            const sub = command.data.options.filter((opt) => opt.name === thereIsSub[0].name)[0];
            subName = sub.name;
            command = this.create(sub);
        }
        command.data.fullName = `${commandName} ${groupName} ${subName}`;
        return command;
    }
    /**
     * Build a slash command with options on it.
     * @param commandData The data of the command
     * @param builder The already built organ.
     * @returns The built slash command.
     */
    static buildSlashCommand(commandData, builder) {
        builder
            .setNSFW(commandData.nsfw || false)
            .setDMPermission(commandData.dmPermission || false)
            .setDefaultMemberPermissions(commandData.defaultMemberPermissions?.toString() || discord_js_1.PermissionFlagsBits['ViewChannel']);
        if (!commandData.options)
            return builder;
        for (const opt of commandData.options) {
            switch (opt.type) {
                case v10_1.ApplicationCommandOptionType['Attachment']:
                    builder.addAttachmentOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Boolean']:
                    builder.addBooleanOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Channel']:
                    builder.addChannelOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Integer']:
                    builder.addIntegerOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Mentionable']:
                    builder.addMentionableOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Number']:
                    builder.addNumberOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['Role']:
                    builder.addRoleOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['String']:
                    builder.addStringOption(opt);
                    break;
                case v10_1.ApplicationCommandOptionType['User']:
                    builder.addUserOption(opt);
                    break;
                default:
                    break;
            }
        }
        return builder;
    }
}
exports.default = CommandManager;
