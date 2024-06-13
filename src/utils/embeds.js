const {EmbedBuilder} = require('discord.js');

/**
 * Belirtilen açıklama ve seçeneklerle bir Discord mesajı için gömülü mesaj oluşturur.
 *
 * @param {string} description - Gömülü mesajın açıklaması.
 * @param {Object} [options] - Gömülü mesajın seçenekleri.
 * @param {string} [options.color=Red] - Gömülü mesajın rengi.
 * @param {Object} [options.title] - Gömülü mesajın başlığı.
 * @param {string} [options.title.text] - Başlık metni.
 * @param {string} [options.title.url] - Başlık URL'si.
 * @param {Object} [options.author] - Gömülü mesajın yazarı.
 * @param {string} [options.author.text] - Yazar metni.
 * @param {string} [options.author.url] - Yazar URL'si.
 * @param {string} [options.author.iconURL] - Yazarın simge URL'si.
 * @param {Object} [options.footer] - Gömülü mesajın altbilgisi.
 * @param {string} [options.footer.text] - Altbilgi metni.
 * @param {string} [options.footer.iconURL] - Altbilgi simge URL'si.
 * @param {string} [options.imageURL] - Gömülü mesajın görüntü URL'si.
 * @param {string} [options.thumbnailURL] - Gömülü mesajın küçük resim URL'si.
 * @param {boolean} [options.timestamp=false] - Zaman damgası ekleyip eklemeyeceği.
 * @param {Object[]} [options.fields] - Gömülü mesajın alanları.
 * @returns {EmbedBuilder} - Oluşturulan gömülü mesaj.
 *
 * @example
 * const embedMessage = embeds("Açıklama metni", {
 *     color: "Blue",
 *     title: { text: "Başlık", url: "http://example.com" },
 *     author: { text: "Yazar", url: "http://authorurl.com", iconURL: "http://iconurl.com" },
 *     footer: { text: "Altbilgi", iconURL: "http://footericon.com" },
 *     imageURL: "http://imageurl.com",
 *     thumbnailURL: "http://thumbnailurl.com",
 *     timestamp: true,
 *     fields: [{ name: "Alan Adı", value: "Alan Değeri", inline: true }]
 * });
 */
const embeds = (description, options = {
    color: "Red",
    title: {
        text: null,
        url: null
    },
    author: {
        text: null,
        url: null,
        iconURL: null
    },
    footer: {
        text: null,
        iconURL: null,
    },
    imageURL: null,
    thumbnailURL: null,
    timestamp: false,
    fields: []
}) => {
    const e = new EmbedBuilder()
        .setDescription(description)
        .setColor(options.color)
        .setTitle(options.title.text)
        .setURL(options.title.url)
        .setAuthor({name: options.author.text, url: options.author.url, icon_url: options.author.iconURL})
        .setFooter({text: options.footer.text, iconURL: options.footer.iconURL})
        .setImage(options.imageURL)
        .setThumbnail(options.thumbnailURL);

    if (options?.timestamp) e.setTimestamp();
    if (options?.fields) e.setFields([...options.fields]);

    return e;


}

/**
 * Hata mesajı içeren bir gömülü mesaj oluşturur.
 *
 * @param {string} description - Gömülü mesajın açıklaması.
 * @param {string} [content=""] - Hata mesajı içeriği.
 * @returns {Object} - İçerik ve gömülü mesaj içeren nesne.
 *
 * @example
 * const errorMessage = errorEmbed("Bir hata oluştu", "Hata mesajı içeriği");
 * // errorMessage içeriği:
 * // {
 * //   content: "Hata mesajı içeriği",
 * //   embeds: [EmbedBuilder]
 * // }
 */
const errorEmbed = (description, content = "") => {
    // return
    return {content, embeds: [embeds(description)]};

}

module.exports = {
    embed: embeds,
    errorEmbed
}