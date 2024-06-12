import { Client, IntentsBitField, EmbedBuilder } from "discord.js";
import mongoose from "mongoose";
import { CommandHandler, ReadyHandler, InteractionHandler } from "ic4d";
const config = require("../config.json");

import { botStatus } from "./status.js";
import path from "path";

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
