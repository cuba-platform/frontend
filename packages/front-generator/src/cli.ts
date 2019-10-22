/* istanbul ignore file */ //todo not sure how to test and cover this
import {generate, collectClients, GeneratedClientInfo} from "./init";
import {Command} from 'commander';
import {exportList} from "./list";
import {extractAvailableOptions, pickOptions} from "./common/cli-options";

const program: Command = require('commander');

export const ownVersion = require('../package').version;

program.version(ownVersion, '-v, --version')
  .usage('[command] [options]');

const clients: GeneratedClientInfo[] = collectClients();

program
  .command('list')
  .description('List all available clients and their clients')
  .option('-s, --save [saveTo]', 'Save information about clients ')
  .action((cmd) => exportList(clients, cmd));

clients.forEach(client => {
  client.generators.forEach(function (generator) {

    const generationCommand = program
      .command(`${client.name}:${generator.name}`)
      .description(`Generates ${client.name} ${generator.name}`);

    extractAvailableOptions(generator.options).forEach(({pattern, description}) => {
      generationCommand.option(pattern, description);
    });

    generationCommand.action(function (cmd) {
      return generate(client.name, generator.name, pickOptions(cmd, generator.options));
    })

  })
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp()
}