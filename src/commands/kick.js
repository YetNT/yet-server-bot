const { SlashCommandManager } = require("ic4d");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { newIncident } = require("../incidentManager");

module.exports = new SlashCommandManager({
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption((o) =>
            o.setName("user").setDescription("user to kick").setRequired(true)
        )
        .addStringOption((o) =>
            o
                .setName("reason")
                .setDescription("reason for the kick")
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

            await newIncident(
                interaction,
                client,
                user,
                reason,
                interaction.user,
                "kick"
            );
        } catch (e) {
            console.error(e);
        }
    },
}).setUserPermissions(
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers
);
