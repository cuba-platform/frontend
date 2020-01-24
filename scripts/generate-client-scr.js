const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const rimraf = promisify(require('rimraf'));

const encodeAnswers = (answers) => {
    return Buffer.from(JSON.stringify(answers)).toString('base64')
};

const generateClientScr = async (clientName, clientDir, modelPath, generators) => {
    const SCR_APP_DIR = path.join(process.cwd(), clientDir);

    console.log(`*** Generating ${clientName} ***`);
    console.log('building front-generator');
    await exec(`lerna run --scope @cuba-platform/front-generator prepublishOnly`);

    !fs.existsSync(SCR_APP_DIR) && fs.mkdirSync(SCR_APP_DIR);
    await rimraf(`${SCR_APP_DIR}/*`);

    console.log(`starting generating ${clientName} into`, SCR_APP_DIR);

    const genCubaFrontCmd = `node ../packages/front-generator/bin/gen-cuba-front`;

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

        await exec('' +
            `cd ${SCR_APP_DIR} && ${genCubaFrontCmd} ${generator.command}` +
            modelArg + dirShift + dest + answers
        );
    }

    console.log(`${clientName} generation - DONE`)
};

module.exports = generateClientScr;