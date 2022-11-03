const fs = require('fs')

function ensureDatabase() {
  const exists = fs.existsSync('./databases/reactionroles.json')
  if (!exists) fs.writeFileSync('./databases/reactionroles.json', '[]')
  try {
    JSON.parse(fs.readFileSync('./databases/reactionroles.json'))
  } catch {
    fs.writeFileSync('./databases/reactionroles.bak.json', fs.readFileSync('./databases/reactionroles.json'))
    console.log('Your reaction role database was corrupted, so we had to reset it. You can find a backup in ./databases/reactionroles.bak.json')
    fs.writeFileSync('./databases/reactionroles.json', '[]')
  }
}

function writeDatabase(data) {
  ensureDatabase()
  fs.writeFileSync('./databases/reactionroles.json', JSON.stringify(data))
}

function getDatabase() {
  ensureDatabase()
  return JSON.parse(fs.readFileSync('./databases/reactionroles.json'))
}

module.exports = {
  add: async (emoji, id, role, channel, emojiName, client) => {
    ensureDatabase()
    const database = getDatabase()
    const foundIndex = database.findIndex(d => d.id == id)
    if (foundIndex === -1)
      database.push({
        id,
        channelId: channel,
        roles: [
          {
            emoji,
            role,
            emojiName
          }
        ]
      })
    else {
      database[foundIndex].roles.push({
        emoji,
        role,
        emojiName
      })
    }
    await (await client.channels.fetch(channel)).messages.fetch(id)
    writeDatabase(database)
  },
  remove: (emoji, id) => {
    ensureDatabase()
    const database = getDatabase()
    const index = database.findIndex(d => d.id == id)
    if (index === -1) return
    const roleIndex = database[index].roles.findIndex(r => r.emoji == emoji)
    if (roleIndex === -1) return
    database[index].roles.splice(roleIndex, 1)
    if (database[index].roles.length === 0) database.splice(index, 1)
    writeDatabase(database)
  },
  get: (emoji, id) => {
    ensureDatabase()
    const database = getDatabase()
    const found = database.find(d => d.id == id)
    const roleFound = found?.roles.find(r => r.emoji == emoji)
    return roleFound
  },
  getAll: () => {
    ensureDatabase()
    return getDatabase()
  },
  cacheAll: client => {
    ensureDatabase()
    const database = getDatabase()
    database.forEach(async ({ channelId, id }) => {
      const channel = await client.channels.fetch(channelId)
      await channel.messages.fetch(id)
    })
  }
}
