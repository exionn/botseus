const { Collection } = require("discord.js");

/**
 * Kullanıcılar için komut bekleme sürelerini kontrol eder.
 *
 * @param {Collection} cooldownsCollection - Tüm komutlar için bekleme sürelerinin koleksiyonu.
 * @param {string} userId - Komutu çalıştıran kullanıcının ID'si.
 * @param {string} commandName - Çalıştırılan komutun adı.
 * @param {number} cooldownAmount - Bekleme süresi (milisaniye cinsinden).
 * @returns {string|boolean} - Uygulanabilir ise kalan bekleme süresini belirten bir mesaj, aksi takdirde false döner.
 *
 * @example
 * const cooldowns = client.cooldowns;
 * const userId = '123456789';
 * const commandName = 'exampleCommand';
 * const cooldownAmount = 5000; // 5 saniye
 *
 * const cooldown = cooldownController(cooldowns, userId, commandName, cooldownAmount);
 * if (cooldown) {
 *   // "Bu komutu tekrar kullanmak için X saniye beklemelisiniz."
 * } else {
 *   // çalıştırılıcak kodlar..
 * }
 */
module.exports = (cooldownsCollection, userId, commandName, cooldownAmount) => {
  if (!cooldownsCollection.has(commandName)) {
    cooldownsCollection.set(commandName, new Collection());
    return false;
  }

  const now = Date.now();
  const commandCooldowns = cooldownsCollection.get(commandName);

  if (!commandCooldowns.has(userId)) {
    commandCooldowns.set(userId, now + cooldownAmount);
    return false;
  }

  const userCooldownTime = commandCooldowns.get(userId);

  if (now < userCooldownTime) {
    const timeLeft = (userCooldownTime - now) / 1000;
    return `Bu komutu tekrar kullanmak için **${timeLeft.toFixed(
      1
    )}** saniye beklemelisiniz.`;
  }

  commandCooldowns.set(userId, now + cooldownAmount);
  return false;
};
