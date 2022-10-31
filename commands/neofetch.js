const { SlashCommandBuilder } = require('discord.js')
const { Instance } = require('chalk')
const os = require('os')
const { getDependency, getVersion, getPackageAmount } = require('../utils/packagejson')

const chalk = new Instance({
  level: 1
})

module.exports = {
  data: new SlashCommandBuilder()
    .setName('neofetch')
    .setDescription('Information about this bot')
    .addBooleanOption(option => option.setName('minimal').setDescription('Show minimal message without ASCII art. Better for mobile screens.')),
  async execute(interaction) {
    const minimal = interaction.options.getBoolean('minimal')
    let uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    uptime %= 3600
    const minutes = Math.floor(uptime / 60)
    const seconds = Math.floor(uptime % 60)

    const cpus = os.cpus()
    const cpu_name = cpus[0].model

    const memes = [`${chalk.red('People who asked')}: 0`, `${chalk.red('Amount of bitches achieved')}: 0`, `${chalk.red('Yo mama')}: phat`, `${chalk.red('Favorite number')}: 69`]

    // prettier-ignore
    const info = [
      `${chalk.red(interaction.client.user.username)} @ ${chalk.red(os.hostname())}`,
      '',
      `${chalk.red("Version")}: ${getVersion()}`,
      `${chalk.red("node")}: ${process.version}`,
      `${chalk.red("discord.js")}: v${getDependency('discord.js').version}`,
      '',
      `${chalk.red("Uptime")}: ${hours ? `${hours} hours, ` : ''}${minutes ? `${minutes} minutes and ` : ''}${seconds} seconds`,
      `${chalk.red("Ping")}: ${interaction.client.ws.ping}ms`,
      '',
      `${chalk.red("Packages")}: ${getPackageAmount()} (npm)`,
      memes[Math.floor(Math.random() * memes.length)],
      `${chalk.red("CPU")}: ${cpu_name} (${cpus.length})`,
      `${chalk.red("Memory")}: ${Math.round((os.totalmem() - os.freemem()) / 1000000)}MB / ${Math.round(os.totalmem() / 1000000)}MB`,
      '',
      `${chalk.black("██")}${chalk.red("██")}${chalk.green("██")}${chalk.yellow("██")}${chalk.blue("██")}${chalk.magenta("██")}${chalk.cyan("██")}${chalk.white("██")}`
    ]
    const ascii = [
      '',
      '         .---::.              ..         ',
      '          .=+++++=-::::::::-=+:          ',
      '          =+#*******+:..:=****+====-     ',
      '          *%%#**++++##**##++++**#%%*     ',
      '          -%%%%%%####+..+#####%%%%%.     ',
      '          :*%%%%%%%%+.:::*%%%%%%%%+      ',
      '          :==+****+-.-+=-.-+****=.       ',
      '          :++=-----::::::::----          ',
      '         -====----------------.          ',
      '        =======--::::::::::::=.          ',
      '       -=++=======:..........=.          ',
      '      .=++++======-::.....:::=.          ',
      '      :=++++======-::::::::---           ',
      '      -++=+++++++=----------:            ',
      '      ==++++++++==--------:              ',
      '      ===++++++++=======:                ',
      '      ==-:=++++++++==++:                 ',
      '          =+++++:..==.                   ',
      '             .==   -=.    ..             ',
      '         ..::::-:::::..:::.              ',
      ''
    ]
    const offset = Math.floor((ascii.length - info.length) / 2)
    return minimal
      ? interaction.reply(`\`\`\`ansi\n \n  ${info.join('\n  ')}\n \`\`\``)
      : interaction.reply(`\`\`\`ansi\n${chalk.blue(ascii.map((a, i) => '  ' + a + '  ' + (info[i - offset] || '')).join('\n'))}\n\n\n\`\`\``)
  }
}
