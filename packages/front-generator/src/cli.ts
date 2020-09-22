/* istanbul ignore file */ //todo not sure how to test and cover this
import {generate, collectClients, GeneratedClientInfo} from "./init";
import {Command} from 'commander';
import {exportList} from "./list";
import {extractAvailableOptions, pickOptions} from "./common/cli-options";

export const ownVersion = require('../package').version;

/**
 * @alpha
 */
export function createAndLaunchCli() {
  const clients: GeneratedClientInfo[] = collectClients();
  const program: Command = createCli(ownVersion, clients);
  launchCli(program);
}

/**
 * @alpha
 */
export function createCli(
  version: string,
  clients: GeneratedClientInfo[],
  customClientNames?: string[],
  customClientsBaseDir?: string
): Command {
  const program: Command = require('commander');

  program.version(version, '-v, --version')
    .usage('[command] [options]');

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

      const baseDir = customClientNames?.includes(client.name) ? customClientsBaseDir : undefined;

      generationCommand.action(function (cmd) {
        return generate(client.name, generator.name, pickOptions(cmd, generator.options), baseDir);
      })

    })
  });

  return program;
}

/**
 * @alpha
 */
export function launchCli(program: Command) {
  program.parse(process.argv); // invokes provided command

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}
