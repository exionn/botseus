const cooldown = require("../controller/cooldownController");
const permissions = require("../controller/permissionsController");
const config = require("../../config");
const { errorEmbed } = require("../utils/embeds");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const prefixes = config.getData("prefixes");

    const prefix = prefixes.find((p) => message.content.startsWith(p));
    if (!prefix) return;

    const client = message.client;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.normalCommands.get(commandName);

    if (!command) return;

    const perms = await permissions(
      message.guild,
      message.author.id,
      message.channel.id,
      command.perms
    );

    if (perms) return sendPermissionsErrorMessage(message, perms);

    const cd = cooldown(
      client.cooldowns,
      message.author.id,
      commandName,
      command.cooldown
    );

    if (cd) return message.reply(errorEmbed(cd));

    try {
      command.execute(client, message, args);
    } catch (e) {
      console.log(e);
    }
  },
};

const sendPermissionsErrorMessage = (message, perms) => {
  let msg;
  if (perms?.user)
    msg = `**Bu komutu kullanmak için şu yetkilere ihtiyacın var:\n> - ${perms.user.join(
      "\n> - "
    )}**`;
  else if (perms?.bot)
    msg = `**Bu komutu kullanmak için şu yetkilere ihtiyacım var:\n> - ${perms.bot.join(
      "\n> - "
    )}**`;
  else if (perms?.channel)
    msg = `**Bu komutu kullanmak için ${
      message.channel
    } üzerinde şu yetkilere ihtiyacım var:\n> - ${perms.channel.join(
      "\n> - "
    )}**`;
  else
    msg =
      "**Yetkiler kontrol edilirken bir hata meydana geldi. Lütfen daha sonra tekrar deneyiniz.**";

  message.reply(errorEmbed(msg.trim())).catch((e) => {
    console.log(e);
    sendUserDM(message.author, errorEmbed(msg.trim()));
  });
};

const sendUserDM = (user, message) => {
  user.send(message).catch((e) => console.log(e));
};
