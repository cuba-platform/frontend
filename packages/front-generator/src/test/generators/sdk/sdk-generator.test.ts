import * as assert from "assert";
import {generate} from "../../../init";
import * as fs from "fs";
import {promisify} from "util";
import * as path from "path";
import {SdkAllGenerator, SdkModelGenerator} from "../../../generators/sdk/sdk-generator";
import * as YeomanEnvironment from "yeoman-environment";
import {expect} from "chai";
import {ERR_STUDIO_NOT_CONNECTED} from "../../../common/studio/studio-integration";

const modelPath = require.resolve('../../fixtures/mpg-projectModel.json');
const rimraf = promisify(require('rimraf'));

const SDK_DIR = `src/test/generated/sdk`;
const SDK_ALL_DIR = path.join(process.cwd(), `${SDK_DIR}/all`);
const SDK_MODEL_DIR = path.join(process.cwd(), `${SDK_DIR}/model`);

describe('sdk generator test', () => {

  before(() => {
    console.log('cleanup', SDK_DIR);
    rimraf(`${SDK_DIR}/*`)
  });

  it('should generate sdk:all', () => rimraf(`${SDK_ALL_DIR}/*`)
    .then(() => generate('sdk', 'all', {
        model: modelPath,
        dest: SDK_ALL_DIR,
        debug: true
      })
    )
    .then(() => {
      assert.ok(fs.existsSync(`services.ts`));
      assert.ok(fs.existsSync(`queries.ts`));
      assert.ok(fs.existsSync(`enums/enums.ts`));
      assert.ok(fs.existsSync(`entities/base`));
    }));

  it('should generate sdk:model', () => rimraf(`${SDK_MODEL_DIR}/*`)
    .then(() => generate('sdk', 'model', {
        model: modelPath,
        dest: SDK_MODEL_DIR,
        debug: true
      })
    )
    .then(() => {
      assert.ok(fs.existsSync(`enums/enums.ts`));
      assert.ok(fs.existsSync(`entities/base`));
      //services and queries should NOT be generated for sdk:model mode
      assert.ok(!fs.existsSync(`services.ts`));
      assert.ok(!fs.existsSync(`queries.ts`));
    }));

  it('should generates sdk for empty model', () => {
    //TODO
  });

  it('should fail writing if no model provided', (done) => {

    const Gen = class extends SdkModelGenerator {
      // noinspection JSUnusedGlobalSymbols
      testing() {
        this.writing()
      }
    };

    runGenerator(Gen, e => {
      expect(e.message).eq('Skip sdk generation - no project model provided');
      done();
    });
  });

  it('should fail if CUBA not connected', (done) => {

    const Gen = class extends SdkAllGenerator {
      // noinspection JSUnusedGlobalSymbols
      testing() {
        this.prompting();
      }
    };

    runGenerator(Gen, e => {
      expect(e.message).eq(ERR_STUDIO_NOT_CONNECTED);
      done();
    });
  });
});

function runGenerator(genClass: any, onError: (e: Error) => void) {
  const env = new YeomanEnvironment();
  env.registerStub(genClass, 'Gen');
  // @ts-ignore
  env.on('error', e => {
    onError(e);
  });
  env.run('Gen');
}


