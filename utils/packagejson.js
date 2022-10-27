const fs = require('fs')

function readPackage() {
  return JSON.parse(fs.readFileSync('./package.json'))
}

function getAllDependencies() {
  const deps = Object.entries(readPackage().dependencies)
  return deps.map(d => ({
    name: d[0],
    version: d[1].replace('^', '')
  }))
}

module.exports = {
  getDependency: name => {
    const all = getAllDependencies()
    const found = all.find(d => d.name === name)
    if (!found) return null
    return found
  },
  getVersion: () => {
    return readPackage().version
  }
}
