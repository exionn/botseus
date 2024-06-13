/**
 * Belirtilen sunucu, kullanıcı ve kanal için gerekli izinleri kontrol eder.
 *
 * @param {Guild} guild - İzinlerin kontrol edileceği sunucu.
 * @param {string} userId - İzinlerin kontrol edileceği kullanıcının ID'si.
 * @param {string} channelId - İzinlerin kontrol edileceği kanalın ID'si.
 * @param {Object} requiredPerms - Gerekli izinleri içeren nesne.
 * @param {string[]} requiredPerms.bot - Botun sahip olması gereken izinler.
 * @param {string[]} requiredPerms.user - Kullanıcının sahip olması gereken izinler.
 * @param {string[]} requiredPerms.channel - Botun kanalda sahip olması gereken izinler.
 * @returns {Promise<Object|boolean>} - Eksik izinler bulunursa eksik izinleri içeren nesne, aksi takdirde false döner.
 *
 * @example
 * const guild = ...; // Discord sunucusu
 * const userId = '123456789';
 * const channelId = '987654321';
 * const requiredPerms = {
 *   bot: ['Administrator'],
 *   user: ['SendMessages'],
 *   channel: ['ViewChannel']
 * };
 *
 * const missingPermissions = await permissionsController(guild, userId, channelId, requiredPerms);
 * if (missingPermissions) {
 *   console.log('Eksik izinler:', missingPermissions);
 * } else {
 *   console.log('Gerekli tüm izinler mevcut.');
 * }
 */
module.exports = async (
  guild,
  userId,
  channelId,
  requiredPerms = { bot: [], user: [], channel: [] }
) => {
  const missingPermissions = {};

  const client = await guild.members.fetchMe();
  const user = await guild.members.fetch(userId);
  const channel = await guild.channels.fetch(channelId);

  const botGuildPerms = client.permissions.toArray();
  const userPerms = user.permissions.toArray();
  const botChannelPerms = client.permissionsIn(channel).toArray();

  requiredPerms.bot.forEach((perm) => {
    if (!botGuildPerms.includes(perm)) {
      if (!missingPermissions.bot) {
        missingPermissions["bot"] = [];
      }
      missingPermissions.bot.push(perm);
    }
  });

  requiredPerms.user.forEach((perm) => {
    if (!userPerms.includes(perm)) {
      if (!missingPermissions.user) {
        missingPermissions["user"] = [];
      }
      missingPermissions.user.push(perm);
    }
  });

  requiredPerms.channel.forEach((perm) => {
    if (!botChannelPerms.includes(perm)) {
      if (!missingPermissions.channel) {
        missingPermissions["channel"] = [];
      }
      missingPermissions.channel.push(perm);
    }
  });

  if (
    !missingPermissions.bot?.length &&
    !missingPermissions.user?.length &&
    !missingPermissions.channel?.length
  ) {
    return false;
  }

  return missingPermissions;
};
