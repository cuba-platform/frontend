import * as commander from 'commander';
import {generate, collectGenerators, collectSubGenerators} from "./init";
import {Command} from 'commander';

const cli: Command = commander;

cli.version(require('../package').version, '-v, --version')
  .usage('[command] [options]');

const generators = collectGenerators();

generators.forEach(generator => {

  const subGenerators = collectSubGenerators(generator.name);

  subGenerators.forEach(function(subgen) {

    cli.command(`${generator.name}:${subgen.name}`);
    if (subgen.options) {
      Object.keys(subgen.options).forEach(optionFullName => {
        const optionInfo = subgen.options![optionFullName];
        let optionPattern = `-${optionInfo.alias}, --${optionFullName}`;
        if (optionInfo.type === String) {
          optionPattern += ` [${optionFullName}]`;
        }
        cli.option(optionPattern, optionInfo.description);
      });
    }

    cli.action(function (name, cmd) {
      const passedOptions: {[key:string]: any} = {};
      if (subgen.options) {
        Object.keys(subgen.options).forEach(optionFullName => {
          if (cmd.hasOwnProperty(optionFullName)) {
            passedOptions[optionFullName] = cmd[optionFullName]
          }
        })
      }
      console.log(`Pass options: ${JSON.stringify(passedOptions)}`);
      return generate(generator.name, subgen.name, passedOptions);
    })

  })

});

cli.parse(process.argv);

if (!process.argv.slice(2).length) {
  cli.outputHelp()
}
