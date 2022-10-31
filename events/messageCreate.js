const { Events } = require('discord.js')
const fs = require('fs')
const phishing = require('../filters/phishing').check
const log = require('../utils/log')

module.exports = {
  event: Events.MessageCreate,
  async listener(message) {
    if (message.author.bot) return
    const phishingLinks = await phishing(message.content)
    if (phishingLinks && phishingLinks.length !== 0) {
      await message.delete()
      const messaged = JSON.parse(fs.readFileSync('./databases/messaged.json'))
      if (messaged[message.author.id]?.time > Date.now() / 1000) return
      message.author.send("Sorry, you can't send that link here!\nThe link was referring to a known phishing scam, so i deleted the message for you.")
      if (!messaged[message.author.id]) messaged[message.author.id] = {}
      messaged[message.author.id].time = Date.now() / 1000 + 300
      fs.writeFileSync('./databases/messaged.json', JSON.stringify(messaged))
      log(message.guild, 'phish', {
        channel: {
          id: message.channel.id
        },
        target: {
          id: message.author.id,
          tag: message.author.tag
        },
        content: message.content,
        site: phishingLinks.join('\n')
      })
    }
  }
}
