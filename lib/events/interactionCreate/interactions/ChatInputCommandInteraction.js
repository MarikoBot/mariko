"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Context_1 = require("../../../root/Context");
/**
 * The function for the ChatInputCommandInteraction interaction.
 *
 * @param client The client instance.
 * @param interaction The associated interaction.
 * @returns Nothing.
 */
async function chatInputCommandInteraction(client, interaction) {
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
exports.default = chatInputCommandInteraction;
