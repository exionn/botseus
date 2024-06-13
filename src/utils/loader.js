const {readdirSync} = require('fs');
const {join} = require('path');
const {Collection} = require("discord.js");


const normalCommandsLoader = (client) => {

    client.normalCommands = new Collection();
    const commandsFolder = join(process.cwd(), 'src', 'commands', 'normal');

    const commandFiles = readdirSync(commandsFolder).filter((file) => file.endsWith('.js'));

    commandFiles.forEach(commandFile => {
        const command = require(join(commandsFolder, commandFile));

        command["cooldown"] = command?.cooldown || 5000;
        command["description"] = command?.description || "Belirtilmemiş!";
        command["dev"] = command?.dev || false;
        command["category"] = command?.category || "Belirtilmemiş!";

        const defaultPerms = {
            bot: [],
            user: [],
            channel: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
        };

        command["perms"] = {
            bot: Array.from(new Set([...(defaultPerms.bot || []), ...(command?.perms?.bot || [])])),
            user: Array.from(new Set([...(defaultPerms.user || []), ...(command?.perms?.user || [])])),
            channel: Array.from(new Set([...(defaultPerms.channel || []), ...(command?.perms?.channel || [])]))
        };

        client.normalCommands.set(command.name, command);
    })
}

const eventsLoader = (client) => {
    const eventsFolder = join(process.cwd(), 'src', 'events');

    const eventFiles = readdirSync(eventsFolder).filter((file) => file.endsWith('.js'));

    eventFiles.forEach((eventFile) => {
        const event = require(join(eventsFolder, eventFile));
        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(...args));
        } else {
            client.on(event.name, async (...args) => await event.execute(...args));
        }
    })

}

module.exports = (client) => {
    client.cooldowns = new Collection();
    normalCommandsLoader(client);
    eventsLoader(client);
};