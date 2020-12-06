import {generate} from "../../../init";
import * as path from "path";
import {promisify} from "util";
import * as fs from "fs";
import * as assert from "assert";

const rimraf = promisify(require('rimraf'));

const modelPath = require.resolve('../../fixtures/mpg-projectModel.json');
const tmpGenerationDir = path.join(process.cwd(), 'src/test/generated');

describe('polymer2 generator', function () {

  it('generates Polymer client', function () {
    return rimraf(`${tmpGenerationDir}/*`)
      .then(() =>
        generate('polymer2', 'app', {
          model: modelPath,
          dest: path.join(tmpGenerationDir, 'polymer2-app'),
          debug: true
        })
      ).then(() => {
        assert.ok(fs.existsSync(`index.html`));
      })
  });

});
