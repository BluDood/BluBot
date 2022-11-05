const fs = require('fs')

function ensureDatabase() {
  const exists = fs.existsSync('./databases/tags.json')
  if (!exists) fs.writeFileSync('./databases/tags.json', '{}')
  try {
    JSON.parse(fs.readFileSync('./databases/tags.json'))
  } catch {
    fs.writeFileSync('./databases/tags.bak.json', fs.readFileSync('./databases/tags.json'))
    console.log('Your tags database was corrupted, so we had to reset it. You can find a backup in ./databases/tags.bak.json')
    fs.writeFileSync('./databases/tags.json', '{}')
  }
}

function writeDatabase(data) {
  ensureDatabase()
  fs.writeFileSync('./databases/tags.json', JSON.stringify(data))
}

function getDatabase() {
  ensureDatabase()
  return JSON.parse(fs.readFileSync('./databases/tags.json'))
}

module.exports = {
  add: async (name, content, image) => {
    ensureDatabase()
    const database = getDatabase()
    if (database[name]) return
    database[name] = {
      name,
      content,
      image
    }
    writeDatabase(database)
  },
  remove: name => {
    ensureDatabase()
    const database = getDatabase()
    delete database[name]
    writeDatabase(database)
  },
  modify: (name, content, image) => {
    ensureDatabase()
    const database = getDatabase()
    if (!database[name]) database[name] = {}
    const item = database[name]
    item.name = name || item.name
    item.content = content || item.content
    item.image = image || item.image
    writeDatabase(database)
  },
  get: name => {
    ensureDatabase()
    return getDatabase()[name]
  },
  getAll: () => {
    ensureDatabase()
    return getDatabase()
  }
}
