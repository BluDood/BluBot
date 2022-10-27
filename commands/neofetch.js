const { SlashCommandBuilder } = require('@discordjs/builders')
const chalk = require('chalk')
const os = require('os')
const { getDependency, getVersion } = require('../utils/packagejson')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('neofetch')
    .setDescription('Information about this bot')
    .addBooleanOption(option =>
      option
        .setName('minimal')
        .setDescription(
          'Show minimal message without ASCII art. Better for mobile screens.'
        )
    ),
  async execute(interaction) {
    const minimal = interaction.options.getBoolean('minimal')
    let uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    uptime %= 3600
    const minutes = Math.floor(uptime / 60)
    const seconds = Math.floor(uptime % 60)

    const cpus = os.cpus()
    const cpu_name = cpus[0].model

    // prettier-ignore
    const info = [
      `${chalk.red("BluBot")} @ ${chalk.red(os.hostname())}`,
      '',
      `${chalk.red("Version")}: ${getVersion()}`,
      `${chalk.red("node")}: ${process.version}`,
      `${chalk.red("discord.js")}: v${getDependency('discord.js').version}`,
      '',
      `${chalk.red("Uptime")}: ${hours ? `${hours} hours, ` : ''}${minutes ? `${minutes} minutes and ` : ''}${seconds} seconds`,
      `${chalk.red("Ping")}: ${interaction.client.ws.ping}ms`,
      '',
      `${chalk.red("OS")}: ${os.version()} ${os.arch()}`,
      `${chalk.red("CPU")}: ${cpu_name} (${cpus.length})`,
      `${chalk.red("Memory")}: ${Math.round(os.freemem() / 1000000)}MB / ${Math.round(os.totalmem() / 1000000)}MB`,
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
      : interaction.reply(
          `\`\`\`ansi\n${chalk.blue(
            ascii
              .map((a, i) => '  ' + a + '  ' + (info[i - offset] || ''))
              .join('\n')
          )}\n\n\n\`\`\``
        )
  }
}
