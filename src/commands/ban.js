const { SlashCommandManager } = require("ic4d");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { newIncident } = require("../incidentManager");
const { ban } = require("../modActions");

module.exports = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .addUserOption((o) =>
            o.setName("user").setDescription("user to ban").setRequired(true)
        )
        .addStringOption((o) =>
            o
                .setName("reason")
                .setDescription("reason for the ban")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason");

            if (!user || !reason) {
                return interaction.reply({
                    content: "Invalid usage. Please provide a user and reason.",
                });
            }

            await ban(interaction, reason, user);

            await newIncident(
                interaction,
                client,
                user,
                reason,
                interaction.user,
                "ban"
            );
        } catch (e) {
            console.error(e);
        }
    },
}).setUserPermissions(
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers
);
