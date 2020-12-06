import * as path from "path";
import * as Base from "yeoman-generator";
import * as YeomanEnvironment from "yeoman-environment";
import * as fs from 'fs';
import {promisify} from "util";
import {format} from '../../test-commons';
import * as assert from 'assert';

const rimraf = promisify(require('rimraf'));

const TPL_FILE_NAME = 'i18nMappings.ts';
const DEST_DIR = path.join(process.cwd(), `src/test/generated/templates`);
const GENERATED_FILE = path.join(DEST_DIR, TPL_FILE_NAME);
const FIXTURES_DIR = path.join(process.cwd(), `src/test/fixtures/templates`);


class CopyTplGenerator extends Base {

  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, '../../fixtures/templates'));
  }

  // noinspection JSUnusedGlobalSymbols
  processTemplate() {

    // noinspection JSUnusedGlobalSymbols
    const model = {
      isLocaleUsed: () => true
    };

    const tplPath = this.templatePath(`${TPL_FILE_NAME}.ejs`);
    console.log('process template tplPath', fs.realpathSync(tplPath));
    console.log('dest dir', fs.realpathSync(DEST_DIR));
    this.fs.copyTpl(tplPath, GENERATED_FILE, model);
  }

}


describe('react generator template processing test', () => {

  it('should correct process ejs template', async () => {

    await rimraf(`${DEST_DIR}/*`);
    !fs.existsSync(DEST_DIR) && fs.mkdirSync(DEST_DIR, {recursive: true});

    const env = new YeomanEnvironment();
    env.registerStub(CopyTplGenerator, 'CopyTplGenerator');
    await env.run('CopyTplGenerator', {});

    format(GENERATED_FILE);

    assert.strictEqual(fs.readFileSync(GENERATED_FILE, 'utf8'),
      fs.readFileSync(path.join(FIXTURES_DIR, TPL_FILE_NAME), 'utf8'));
  });

});
