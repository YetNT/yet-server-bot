const Incident = require("./incident");
const {
    User,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    userMention,
} = require("discord.js");
const modActions = require("./modActions");
/**
 *
 * @param {string} userId
 * @param {boolean} warningsOnly
 */
export async function getIncidents(userId, warningsOnly = false) {
    const incidents = await Incident.find(
        warningsOnly ? { userId, type: "warn" } : { userId }
    );
    return incidents;
}

const warnings = {
    MUTE: 3,
    KICK: 5,
    BAN: 7,
};

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 * @param {User} user
 * @param {string} reason
 * @param {User} reportedBy
 * @param {string} incidentType
 * @param {number}muteTime seconds
 */
export async function newIncident(
    interaction,
    client,
    user,
    reason,
    reportedBy,
    incidentType,
    muteTime = 0
) {
    if (!["warn", "ban", "mute", "kick"].includes(incidentType)) return;
    const incident = await (async (user, reason, reportedBy, incidentType) => {
        const incident = await Incident.create({
            userId: user.id,
            description: reason,
            reportedBy: reportedBy.id,
            type: incidentType,
        });
        await incident.save();

        return incident;
    })(user, reason, reportedBy, incidentType);

    const channel = client.guilds.cache
        .get("794139215612870697")
        .channels.cache.get("796411298921054279");

    const n = (await getIncidents(user.id, true)).length;

    const embed = new EmbedBuilder()
        .setTitle(`Incident #${incident.incidentId}`)
        .setDescription(
            incidentType == "warn"
                ? `${userMention()} has been warned by ${userMention(
                      reportedBy.id
                  )}\n\n**Reason:** ${reason}`
                : incidentType == "mute"
                ? `${userMention()} has been __muted__ by ${userMention(
                      reportedBy.id
                  )} for ${muteTime} seconds.\n\n**Reason:** ${reason}`
                : incidentType == "kick"
                ? `${userMention()} has been ___kicked___ by ${userMention(
                      reportedBy.id
                  )}\n\n**Reason:** ${reason}`
                : `${userMention(
                      user.id
                  )} has been **_BANNED_** by ${userMention(
                      reportedBy.id
                  )}:\n\n**Reason:** ${reason}`
        )
        .setTimestamp(incident.date)
        .setColor(
            incidentType == "warn"
                ? "Orange"
                : incidentType == "mute"
                ? "White"
                    ? incidentType == "kick"
                    : "Greyple"
                : "Red"
        );

    if (incidentType === "warn") {
        if (n == warnings.MUTE) {
            const newReason = `user reached ${warnings.MUTE} amount of incidents. Automatic mute was ensued.`;
            modActions.mute(interaction, user, 1200);
            await newIncident(
                interaction,
                client,
                user,
                newReason,
                client.user,
                incidentType,
                1200
            );
        }
        if (n == warnings.KICK) {
            const newReason = `user reached ${warnings.KICK} amount of incidents. Automatic kick was ensued.`;
            modActions.kick(interaction, newReason, user);
            await newIncident(
                interaction,
                client,
                user,
                newReason,
                client.user,
                incidentType
            );
        }
        if (n == warnings.BAN) {
            const newReason = `user reached ${warnings.BAN} amount of incidents. Automatic ban was ensued.`;
            modActions.ban(interaction, newReason, user);
            await newIncident(
                interaction,
                client,
                user,
                newReason,
                client.user,
                incidentType
            );
        }
    }

    channel.send({ embeds: [embed] });
}
