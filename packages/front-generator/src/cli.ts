import * as commander from 'commander';
import {generate, collectGenerators, collectSubGenerators} from "./init";
import {Command} from 'commander';

const cli: Command = commander;

cli.version(require('../package').version, '-v, --version')
  .usage('[command] [options]');

const generators = collectGenerators();

generators.forEach(generator => {

  const subGenerators = collectSubGenerators(generator.name);

  subGenerators.forEach(subgen => {
    cli.command(`${generator.name}:${subgen.name}`);
    if (subgen.options) {
      Object.keys(subgen.options).forEach(optionFullName => {
        const optionInfo = subgen.options![optionFullName];
        cli.option(`-${optionInfo.alias}, --${optionFullName}`, optionInfo.description);
      });
    }
    cli.action(async (cmd) => {
      const passedOptions: {[key:string]: any} = {};
      if (subgen.options) {
        Object.keys(subgen.options).forEach(optionFullName => {
          if (cmd.hasOwnProperty(optionFullName)) {
            passedOptions[optionFullName] = cmd[optionFullName]
          }
        })
      }
      await generate(generator.name, subgen.name, passedOptions);
    })
  })

});

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}
