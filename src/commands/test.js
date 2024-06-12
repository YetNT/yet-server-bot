const { SlashCommandObject } = require("ic4d");
const { Client } = require("discord.js");

const a = new SlashCommandObject({
    name: "ping",
    description: "Pong!",
    callback: async (client, interaction) => {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
});
module.exports = a;
