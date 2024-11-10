const { SlashCommandManager } = require("ic4d");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { newIncident } = require("../incidentManager");
const { mute } = require("../modActions");

module.exports = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a user")
        .addUserOption((o) =>
            o.setName("user").setDescription("user to mute").setRequired(true)
        )
        .addStringOption((o) =>
            o
                .setName("reason")
                .setDescription("reason for the mute")
                .setRequired(true)
        )
        .addIntegerOption((o) =>
            o
                .setName("duration")
                .setDescription("Duration for the mute. (In seconds)")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason");
            const dur = interaction.options.getInteger("duration");

            if (!user || !reason || !dur) {
                return interaction.reply({
                    content: "Invalid usage. Please provide a user and reason.",
                });
            }

            await mute(interaction, user, dur);

            await newIncident(
                interaction,
                client,
                user,
                reason,
                interaction.user,
                "mute",
                dur
            );
        } catch (e) {
            console.error(e);
        }
    },
}).setUserPermissions(
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers
);
