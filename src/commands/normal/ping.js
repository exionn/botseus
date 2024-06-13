module.exports = {
  name: "ping",
  description: "Pong!",
  async execute(client, message, args) {
    message.reply(`Pong! **${Math.abs(client.ws.ping)}MS**`);
  },
};
