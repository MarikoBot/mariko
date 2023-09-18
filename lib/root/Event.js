"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEventsCb = exports.callbackDefault = void 0;
const discord_js_1 = require("discord.js");
const Util_1 = require("./Util");
const Context_1 = require("./Context");
const Emojis_1 = require("../res/Emojis");
/**
 * A default callback function used when nothing is set.
 * @returns Void.
 */
async function callbackDefault() {
    return void setTimeout(() => null);
}
exports.callbackDefault = callbackDefault;
/**
 * Represents an Event on client service.
 */
class Event {
    /**
     * The client instance.
     */
    client;
    /**
     * The event name.
     */
    name;
    /**
     * The callback function.
     */
    callback;
    /**
     * @param client The client instance.
     * @param name The event name.
     */
    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.callback = callbackDefault;
    }
}
exports.default = Event;
/**
 * The collection that includes the default callback functions for basic events.
 */
exports.defaultEventsCb = new discord_js_1.Collection();
exports.defaultEventsCb.set('ready', async (client) => {
    (0, Util_1.log)(`Logged in as ${client.user.tag}.`);
    await (await client.Services.AdminPanel(client, '1139950254322626751', '1113177643710423060')).refreshChannel();
});
exports.defaultEventsCb.set('interactionCreate', async (client, interaction) => {
    if (interaction.isButton() || interaction.isAnySelectMenu()) {
        if (interaction.customId.startsWith('autoDefer'))
            await interaction.deferUpdate().catch(Util_1.clean);
        if (interaction.isButton() && interaction.customId.includes('adminPanel')) {
            const panel = await client.Services.AdminPanel(client, interaction.channel.id, interaction.guild.id);
            await panel.handle(interaction);
        }
    }
    if (interaction.isChatInputCommand()) {
        const command = client.Commands.getCommand(interaction);
        if (!command)
            return;
        const ctx = new Context_1.default(interaction.channel, command, interaction, interaction.user);
        ctx.command = command;
        ctx.interaction = interaction;
        command.ctx = ctx;
        await ctx.loadLanguage();
        const activeCoolDowns = client.Commands.CoolDowns.coolDowns(interaction.user.id, command.data.fullName);
        const activeInterfering = client.Commands.Interfering.interfering(interaction.user.id, ...(command.data.interferingCommands || []));
        if (activeCoolDowns.length > 0) {
            const finishTime = String(activeCoolDowns[0][1] / 1000).split('.')[0];
            const translated = ctx.translate('activeCoolDown', command.data.fullName, finishTime);
            return void (await ctx.reply(translated));
        }
        if (activeInterfering.length > 0) {
            const interferingList = activeInterfering
                .map((i) => `</${i[0]}:${i[1].commandId}>`)
                .join(', ');
            const translated = ctx.translate('activeInterfering', interferingList);
            return void (await ctx.reply(translated));
        }
        const authorized = await command.isAuthorized(interaction);
        if (!authorized)
            return;
        client.Commands.Interfering.registerInterfering(interaction.user.id, command.data.fullName, interaction);
        client.Commands.CoolDowns.registerCoolDown(interaction.user.id, command.data.fullName, command.data.coolDown || 0);
        await command.execute(client, interaction, ctx);
    }
    else if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('blacklist')) {
            const data = interaction.fields;
            const blacklist = (await client.Services.AdminPanel(client, interaction.channel.id, interaction.guild.id)).blacklist;
            if (interaction.customId === 'blacklist_add') {
                const tested = await blacklist.validAddModal(data);
                let finalMessage;
                if (tested.valid) {
                    finalMessage = `<t:${(0, Util_1.discordDate)()}:T> | ${Emojis_1.default.coloredFlag}${Emojis_1.default.coloredCheck} | Object \`${tested.name}\` *successfully** added to the blacklist.`;
                    if (tested.errors.length > 0)
                        finalMessage += `\n\`Warnings:\`\n>>> ${tested.errors.join('\n')}`;
                }
                else {
                    finalMessage = `<t:${(0, Util_1.discordDate)()}:T> | ${Emojis_1.default.coloredFlag}${Emojis_1.default.coloredCancel} | Object \`${tested.name}\` **cannot be** added to the blacklist.`;
                    if (tested.errors.length > 0)
                        finalMessage += `\n\`Errors:\`\n>>> ${tested.errors.join('\n')}`;
                }
                await interaction.reply({ content: finalMessage, ephemeral: true }).catch(Util_1.clean);
            }
        }
    }
});
