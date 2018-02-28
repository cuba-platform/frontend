import {generate, collectGenerators, collectSubGenerators} from "./init";
import {Command} from 'commander';

const program: Command = require('commander');

program.version(require('../package').version, '-v, --version')
  .usage('[command] [options]');

const generators = collectGenerators();

program
  .command('list')
  .description('List all available generators')
  .action(function () {
    console.log(generators.reduce((prev, gen, i) => prev += (i === 0 ? '' : ',') + gen.name, ''));
  });

generators.forEach(generator => {

  const subGenerators = collectSubGenerators(generator.name);

  subGenerators.forEach(function (subgen) {

    const command = program
      .command(`${generator.name}:${subgen.name}`)
      .description(`Generates ${generator.name} ${subgen.name}`);


    if (subgen.options) {
      Object.keys(subgen.options).forEach(optionFullName => {
        const optionInfo = subgen.options![optionFullName];
        let optionPattern = `-${optionInfo.alias}, --${optionFullName}`;
        if (optionInfo.type === String) {
          optionPattern += ` [${optionFullName}]`;
        }
        command.option(optionPattern, optionInfo.description);
      });
    }

    command.action(function (cmd) {
      const passedOptions: { [key: string]: any } = {};
      if (subgen.options) {
        Object.keys(subgen.options).forEach(optionFullName => {
          if (cmd.hasOwnProperty(optionFullName)) {
            passedOptions[optionFullName] = cmd[optionFullName]
          }
        })
      }
      return generate(generator.name, subgen.name, passedOptions);
    })

  })

});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
