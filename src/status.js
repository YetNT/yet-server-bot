// eslint-disable-next-line no-unused-vars
import { ActivityType, Client, PresenceData } from "discord.js";

const presences = (status) => {
    let st = {};
    let random = Math.floor(Math.random() * status.main.length);
    st = {
        status: "idle",
        activities: [status.main[random]],
    };
    return st;
};

const botStatus = (client) => {
    // eslint-disable-next-line no-unused-vars
    let status = {
        main: [
            {
                name: "the gulag",
                type: ActivityType.Competing,
            },
            {
                name: `Minecraft`,
                type: ActivityType.Playing,
            },
            {
                name: "For",
                type: ActivityType.Playing,
            },
            {
                name: "ayy",
                type: ActivityType.Playing,
            },
        ],
    };

    setInterval(() => {
        client.user.setPresence(presences(status));
    }, 20000);
};

module.exports = botStatus;
