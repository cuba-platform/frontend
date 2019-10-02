import * as assert from "assert";
import {generate} from "../../../init";
import * as path from "path";
import {promisify} from "util";
import * as fs from "fs";

const rimraf = promisify(require('rimraf'));

const modelPath = require.resolve('../../fixtures/mpg-projectModel.json');
const REACT_DIR = path.join(process.cwd(), `src/test/generated/react-client`);


describe('react generator test', () => {
  it('should generates React client', function () {

    return rimraf(`${REACT_DIR}/*`)
      .then(() =>
        generate('react-typescript', 'app', {
          model: modelPath,
          dest: REACT_DIR,
          debug: true
        })
      )
      .then(() => {
        assert.ok(fs.existsSync(`entities/base`));
        assert.ok(fs.existsSync(`enums/enums.ts`));
      });
  });

  it('should generate, compile and run React Client with empty model', function () {
    //todo - may be move to e2e
  });
});