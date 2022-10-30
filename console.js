const chalk = require('chalk')
const sleep = require('./utils/sleep')

async function motd(tag) {
  console.clear()
  const ascii = `______ _      ______       _   
| ___ \\ |     | ___ \\     | |  
| |_/ / |_   _| |_/ / ___ | |_ 
| ___ \\ | | | | ___ \\/ _ \\| __|
| |_/ / | |_| | |_/ / (_) | |_ 
\\____/|_|\\__,_\\____/ \\___/ \\__|
===============================
`.split('\n')
  for (let line of ascii) {
    console.log(chalk.hex('#0064FF')(line))
    await sleep(50)
  }
  tag && console.log(`Welcome to BluBot! Your bot (${tag}) is now running.`)
  console.log('Press h for help.')
}

const commands = {
  h: () => {
    console.log(`
  [h] Show this help page
  [m] Show the MOTD
  [u] Show uptime
  [q] Quit
    `)
  },
  m: motd,
  u: () => {
    let uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    uptime %= 3600
    const minutes = Math.floor(uptime / 60)
    const seconds = Math.floor(uptime % 60)
    console.log(chalk.yellow(`\nUptime: ${hours ? `${hours} hours, ` : ''}${minutes ? `${minutes} minutes and ` : ''}${seconds} seconds.`))
  },
  q: () => {
    console.log('Goodbye!')
    process.exit()
  }
}

module.exports = {
  init: () => {
    console.clear()
    console.log(chalk.yellow('Starting BluBot...'))
    process.stdin.setRawMode?.(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    process.stdin.on('data', key => {
      if (key === '\u0003') process.exit()
      const found = commands[key]
      if (!found) return
      found()
    })
  },
  motd
}
