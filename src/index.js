const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const { CommandHandler, ReadyHandler, InteractionHandler } = require("ic4d");
const config = require("../config.json");
require("dotenv").config();

const botStatus = require("./status.js");
const path = require("path");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
    ],
});

const handler = new CommandHandler(client, path.join(__dirname, "commands"), {
    devs: [...config.devs],
});

const ready = new ReadyHandler(
    client,
    async () => {
        await handler.registerCommands();
    },
    botStatus,
    (client) => {
        console.log(`${client.user.tag} is online.`);
    }
);

(async () => {
    try {
        await handler.handleCommands();
        await ready.execute();
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to DB");
        // Use the dbPost middleware and routes
    } catch (error) {
        console.log(`db error ${error}`);
    }
})();

client.login(process.env.MAIN);
