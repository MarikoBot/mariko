"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookSend = exports.renderWebhooksEmbeds = void 0;
const discord_js_1 = require("discord.js");
const Util_1 = require("./root/Util");
const Util_2 = require("./root/Util");
/**
 * Function that format .mariko to webhook embeds.
 * @param content The .mariko file content.
 * @returns The embeds.
 */
function renderWebhooksEmbeds(content) {
    const embeds = [];
    if (content === 'dojo_rules') {
        embeds.push(new discord_js_1.EmbedBuilder().setImage('https://cdn.discordapp.com/attachments/1012372287640567948/1159409615755300884/Rules.png?ex=6530eb59&is=651e7659&hm=6cc8d5ce8131f263357a763559e8d57ff51a3d1b94cda1db4b5d571cc828b851&'), new discord_js_1.EmbedBuilder().setDescription('### Le règlement de ce serveur est à lire, à comprendre et à accepter. En cas de litige, nous nous appuierons sur ce dernier. Nous rappelons également que tout membre de ce serveur se doit de respecter les ToS de Discord.'), new discord_js_1.EmbedBuilder().setTitle('I. 🍡 Tenue Générale').setFields({
            name: 'Votre profil doit être conforme.',
            value: '> Il ne doit pas offenser qui que ce soit, doit être facilement identifiable. Ceci interdit également le contenu pornographique et choquant.\n᲼',
        }, {
            name: 'Veuillez avoir un comportement respectueux envers les autres membres.',
            value: "> Les insultes et le contenu choquant ne sont pas autorisés. Toute forme d'irrespect est interdit. L'incitation à la haine n'est pas autorisée. Veuillez ne pas faire de nuisance sonore dans les salons vocaux.\n᲼",
        }, {
            name: "L'encombrement des salons est interdit.",
            value: '> Toute forme de dérangement comme le spam, le flood ou autre est interdit.\n᲼',
        }, {
            name: 'Le spoil est interdit.',
            value: "> Vos profils peuvent spoil, mais évitez par respect. Il s'agit là de bon sens.\n᲼",
        }, {
            name: "La diffusion d'informations personnelles est interdite.",
            value: '> Veuillez faire attention lorsque vous utilisez le prénom de vos amis.\n᲼',
        }, {
            name: 'Toute menace envers le serveur ou tout projet lié au serveur est interdite.',
            value: '> Il en va du serveur et des bots liés.\n᲼',
        }), new discord_js_1.EmbedBuilder().setTitle("II. 💵 L'économie (UnbelievableBoat)").setFields({
            name: "L'alting n'est pas autorisé.",
            value: "> Seulement un compte peut servir à jouer par personne. Les transferts d'argent vers un alt sont interdits.\n᲼",
        }, {
            name: 'La triche est interdite.',
            value: '> Toute tentative de triche est sanctionnée.\n᲼',
        }, {
            name: 'Pas de remboursement en cas de vol.',
            value: "> Le fait de faire partie d'une alliance ne vous protège pas contre les potentiels vols de la part des gens de votre alliance. Aucune organisation n'est officielle et aucune n'est protégée par des quelconques règles.\n᲼",
        }), new discord_js_1.EmbedBuilder()
            .setTitle('III. 🀄 Mudae')
            .setDescription("**Il est interdit de claim un personnage provenant des rolls de quelqu'un d'autre.**\n" +
            "> Lorsque quelqu'un fait ses rolls, vous avez l'interdiction de claim un de ses personnages sans son accord explicite. Si la personne ne peut pas claim, vous pouvez vous servir ; cependant, si la personne possède un `rt` et que vous lui prenez son personnage, vous êtes en infraction.\n\n" +
            '> L\'accord donné doit être clair et net. Un "euhh" n\'étant pas considéré comme une réponse positive.\n\n' +
            "> De plus, il en va de bon sens que le roller doive indiquer clairement la réponse concernant le fait de pouvoir claim ou non. Si le roller empêche quelqu'un de claim un personnage qu'il ne prend finalement pas, la victime peut ouvrir un ticket dans le salon support afin de contester.\n\n" +
            '> Pour demander la permission de claim, veuillez mentionner le roller. En cas de non réponse de sa part au bout de 10 secondes, vous pouvez prendre __uniquement si le personnage est un de vos wishes__.\n\n' +
            "> En cas de non respect de cette règle, le voleur devra donner le personnage au roller. Des sanctions sévères peuvent s'appliquer quant au nom respect de cette règle. Si il y a récidive, un reset complet du harem du voleur sera envisagé ; voir un bannissement du salon Mudae.\n᲼")
            .setFields({
            name: "Merci de ne pas faire vos rolls en même temps qu'une autre personne.",
            value: "> N'hésitez pas à demander si le salon est disponible si nécessaire. Indiquez quand vous faites vos rolls et indiquez quand vous les terminez si vous savez que d'autres personnes attendent leur tour.\n᲼",
        }, {
            name: "L'alting n'est pas autorisé.",
            value: "> Seulement un compte peut servir à jouer par personne. Les transferts de personnages vers un alt sont interdits. Peu importe le fond ou la forme, l'utilisation d'un double compte est interdite.\n᲼",
        }), new discord_js_1.EmbedBuilder()
            .setTitle('IV. 🔑 Les sanctions.')
            .setDescription("> Lorsqu'il est nécessaire, un timeout sera la solution la plus priorisée en cas de mauvais comportement. Une fois la discussion terminée, des sanctions supplémentaires peuvent s'appliquer ou non.\n\n" +
            '> Le staff vous avertira pour les infractions avec le système de warns ; ces warns sont irrévocables.\n\n' +
            '> Le staff ne doit utiliser que DraftBot pour les actions de modération:\n' +
            "> </warn:1013563480755945594> : permet d'avertir un membre.\n" +
            "> </sanctions list:1013563480676257867> : permet de voir la liste des sanctions d'un membre.\n" +
            "> </sanctions remove:1013563480676257867> : permet de retirer l'avertissement d'un membre.\n\n" +
            '> De plus, le staff doit pouvoir justifier les sanctions infligées.'), new discord_js_1.EmbedBuilder()
            .setDescription('Ce règlement est susceptible à des changements et vous en serez avertis. De plus, si vous souhaitez plus de précisions, vous pouvez retrouver un média vidéoludique complémentaire : [Règlement.mp4](https://media.discordapp.net/attachments/1127024754881220630/1127030465023459439/Koc6iWx.mp4). *(la vidéo se télécharge.)*\n\n' +
            "__Nous vous souhaitons un agréable séjour sur Le Dojo. - L'équipe du staff.__")
            .setFooter({ text: 'Dernière modification' })
            .setTimestamp());
    }
    for (const embed of embeds)
        embed.setColor(Util_2.Colors.DARK);
    return embeds;
}
exports.renderWebhooksEmbeds = renderWebhooksEmbeds;
/**
 * Function that creates and sends a webhook in the given guild and given channel.
 *
 * @param client The client instance.
 * @param avatar The avatar link of the webhook.
 * @param title The name/title of the webhook.
 * @param channelId The channel id of the webhook.
 * @param guildId The guild id of the webhook.
 * @param messageContent The content to send.
 * @returns Nothing.
 */
async function webhookSend(client, avatar, title, channelId, guildId, messageContent) {
    const channel = (await (0, Util_1.IdToCtxChannel)(client, guildId, channelId));
    const webhook = await channel.createWebhook({
        name: title,
        avatar,
    });
    await webhook.send(messageContent).catch(Util_1.clean);
}
exports.webhookSend = webhookSend;
/**
 * The default function that executes the different processes after the default execution.
 *
 * @param client The client instance.
 * @returns Nothing.
 */
async function default_1(client) {
    const embeds = renderWebhooksEmbeds('dojo_rules');
    /* await webhookSend(
      client,
      'https://cdn.discordapp.com/attachments/1012372287640567948/1159915372758183956/91bae0c202f6b818dbf111d4be3b25e3.jpg?ex=6532c25f&is=65204d5f&hm=aadb2a285d163b1319e4ea950f449e48c4898967fe9a26e5429e7aae5cdda9ee&',
      'Règlement',
      '1025846490087817236',
      '922404341107798036',
      { embeds },
    ); */
}
exports.default = default_1;
