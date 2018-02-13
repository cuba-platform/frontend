import * as commander from 'commander';
import {generate, collectGenerators} from "./init";
import {Command} from 'commander';

const cli: Command = commander;

cli.version(require('../package').version, '-v, --version');

async function initCommands(cli: Command) {

  const generators = await collectGenerators();

  generators.forEach(generator => {
    cli
      .command(`${generator.name}`)
      .action(async function () {
         await generate(generator);
      });
  });
}

initCommands(cli).then(() => {
  cli.parse(process.argv);

  if (!process.argv.slice(2).length) {
    cli.outputHelp()
  }
});