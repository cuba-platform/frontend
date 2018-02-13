import * as commander from 'commander';
import {generate, getLocalClients} from "./generator";
import {Command} from "commander";

const cli: Command = commander;

cli.version(require('../package').version, '-v, --version');

cli
  .command('client [clientType]')
  .description('Creates a new application by specified preset')
  .action(async function (clientType: string) {
    const localClients = await getLocalClients();

    const clientInfo = localClients.find(c => c.name === clientType);
    if (!clientInfo) {
      console.log(localClients.map(c => c.name));
      throw new Error('Please specify client type')
    }

    await generate(clientInfo);
  });

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}