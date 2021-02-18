const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const {runCmdSync} = require('./common');
const rimraf = promisify(require('rimraf'));

const encodeAnswers = (answers) => {
    return Buffer.from(JSON.stringify(answers)).toString('base64')
};

const generateClientScr = async (clientName, clientDir, modelPath, generators) => {
    const SCR_APP_DIR = path.join(process.cwd(), clientDir);

    console.log(`*** Generating ${clientName} ***`);
    console.log('building front-generator');
    runCmdSync(`lerna run --scope @haulmont/jmix-front-generator prepublishOnly`);

    !fs.existsSync(SCR_APP_DIR) && fs.mkdirSync(SCR_APP_DIR);
    await rimraf(`${SCR_APP_DIR}/*`);

    console.log(`starting generating ${clientName} into`, SCR_APP_DIR);

    const genCubaFrontCmd = `node ../packages/jmix-front-generator/bin/gen-jmix-front`;

    for (const generator of generators) {
        if (!generator.command) {
            console.error('ERROR: command is not specified');
            process.exit(1);
        }
        console.log(`executing generator command ${generator.command}`);

        const modelArg = modelPath ? ` --model ${path.join(process.cwd(), modelPath)}` : '';
        const dirShift = generator.dirShift ? ` --dirShift ${generator.dirShift}` : '';
        const dest = generator.dest ? ` --dest ${generator.dest}` : '';
        const answers = generator.answers ? ` --answers ${encodeAnswers(generator.answers)}` : '';

        runCmdSync('' +
            `cd ${SCR_APP_DIR} && ${genCubaFrontCmd} ${generator.command}` +
            modelArg + dirShift + dest + answers
        );
    }

    console.log(`${clientName} generation - DONE`)
};

module.exports = generateClientScr;