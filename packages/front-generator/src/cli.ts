import * as commander from "commander";
import {initialize} from "./generator";

const cli = commander;

cli.version(require('../package').version, '-v, --version');

cli
  .command('client [clientType]')
  .action(async function (clientType) {
    await initialize();
    if (!clientType) {
      throw new Error('client type is not specified');
    }
  });


cli.parse(process.argv);