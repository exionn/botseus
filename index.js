const { Client, GatewayIntentBits } = require("discord.js");
const loader = require("./src/utils/loader.js");

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  presence: {
    status: "idle",
    activities: [{ name: "Yetkimi geri istiyorum", type: 0 }],
  },
});

const { getData } = require("./config.js");

loader(client);

client.login(getData("token"));
