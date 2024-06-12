import { SlashCommandObject } from "ic4d";
import { Client } from "discord.js";

const a = new SlashCommandObject({
    name: "ping",
    description: "Pong!",
    callback: async (client, interaction) => {
        await interaction.reply({ content: "Pong!", ephemeral: true });
    },
});
module.exports = a;
