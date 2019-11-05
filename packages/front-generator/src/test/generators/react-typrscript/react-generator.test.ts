import * as assert from "assert";
import {generate} from "../../../init";
import * as path from "path";
import {promisify} from "util";
import * as fs from "fs";
import {assertContent} from '../../test-commons';

const rimraf = promisify(require('rimraf'));

const modelPath = require.resolve('../../fixtures/mpg-projectModel.json');
const answers = require('../../fixtures/answers.json');

const REACT_DIR = path.join(process.cwd(), `src/test/generated/react-client`);
const COMPONENT_DIR = path.join(REACT_DIR, 'src/app/component');
const CARDS_DIR = path.join(REACT_DIR, 'src/app/entity-cards');
const EM_DIR = path.join(REACT_DIR, 'src/app/entity-management');

const FIXTURES_DIR = path.join(process.cwd(), `src/test/fixtures/react-client`);


describe('react generator test', () => {
  it('should generates React client app', async function () {

    await rimraf(`${REACT_DIR}/*`);

    await generate('react-typescript', 'app', opts(REACT_DIR, null));
    assert.ok(fs.existsSync(`entities/base`));
    assert.ok(fs.existsSync(`enums/enums.ts`));
    assertFiles('src/index.tsx');
  });

  it('should generate React client blank-component', async function () {

    await rimraf(`${COMPONENT_DIR}/*`);

    await generate('react-typescript', 'blank-component',
      opts(COMPONENT_DIR, answers.blankComponent));

    assertFiles('src/app/component/BlankComponent.tsx');
  });

  it('should generate React client entity-cards', async function () {

    await rimraf(`${CARDS_DIR}/*`);

    await generate('react-typescript', 'entity-cards',
      opts(CARDS_DIR, answers.entityCards));

    assertFiles('src/app/entity-cards/MpgFavoriteCarCards.tsx');
  });

  it('should generate React client entity-management', async function () {

    await rimraf(`${EM_DIR}/*`);

    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement2));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement3));

    assertFiles('src/app/entity-management/CarCards.tsx');
    assertFiles('src/app/entity-management/CarEdit.tsx');
    assertFiles('src/app/entity-management/CarList.tsx');
    assertFiles('src/app/entity-management/CarTable.tsx');
    assertFiles('src/app/entity-management/CarManagement.tsx');
  });

});

function opts(dir: string, answers: any) {
  return {
    model: modelPath,
    dest: dir,
    debug: true,
    answers: Buffer.from(JSON.stringify(answers)).toString('base64')
  }
}

function assertFiles(filePath: string) {
  const actual = fs.readFileSync(path.join(REACT_DIR, filePath), 'utf8');
  const expect = fs.readFileSync(path.join(FIXTURES_DIR, filePath), 'utf8');
  assertContent(actual, expect);
}
