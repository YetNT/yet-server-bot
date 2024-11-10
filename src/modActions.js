const { ChatInputCommandInteraction, User } = require("discord.js");

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {User} user
 * @param {number} time
 */
export async function mute(interaction, user, time) {
    const roleId = "797500293549654046";
    const guildmember = await interaction.guild.members.fetch(user.id);
    await guildmember.roles.add(roleId);

    setTimeout(() => {
        target.roles.remove(mutedRole); // remove the role
    }, time * 1_000);
}

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {string} reason
 * @param {User} user
 * @param {number} time
 */
export async function kick(interaction, reason, user) {
    const guildmember = await interaction.guild.members.fetch(user.id);
    await guildmember.kick(reason);
}

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 * @param {string} reason
 * @param {User} user
 * @param {number} time
 */
export async function ban(interaction, reason, user) {
    const guildmember = await interaction.guild.members.fetch(user.id);
    await guildmember.ban(reason);
}
