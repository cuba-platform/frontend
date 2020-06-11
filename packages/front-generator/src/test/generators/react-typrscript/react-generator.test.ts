import * as assert from "assert";
import {generate} from "../../../init";
import * as path from "path";
import {promisify} from "util";
import * as fs from "fs";
import {assertFiles, opts} from '../../test-commons';

const rimraf = promisify(require('rimraf'));

const modelPath = require.resolve('../../fixtures/mpg-projectModel.json');
const modelPathScr = require.resolve('../../fixtures/project-model--scr.json');
const answers = require('../../fixtures/answers.json');
const stringIdAnswers = require('../../fixtures/answers/string-id-management-table.json');

const REACT_DIR = path.join(process.cwd(), `src/test/generated/react-client`);
const COMPONENT_DIR = path.join(REACT_DIR, 'src/app/component');
const CARDS_DIR = path.join(REACT_DIR, 'src/app/entity-cards');
const EM_DIR = path.join(REACT_DIR, 'src/app/entity-management');

const FIXTURES_DIR = path.join(process.cwd(), `src/test/fixtures/react-client`);


describe('react generator test', () => {
  it('should generates React client app', async function () {

    await rimraf(`${REACT_DIR}/*`);

    await generate('react-typescript', 'app', opts(REACT_DIR, null, modelPath));
    assert.ok(fs.existsSync(`entities/base`));
    assert.ok(fs.existsSync(`enums/enums.ts`));
    assertFiles('src/index.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('.env.development.local', REACT_DIR, FIXTURES_DIR);
    assertFiles('.env.production.local', REACT_DIR, FIXTURES_DIR);
  });

  it('should generate React client blank-component', async function () {

    await rimraf(`${COMPONENT_DIR}/*`);

    await generate('react-typescript', 'blank-component',
      opts(COMPONENT_DIR, answers.blankComponent, modelPath));

    assertFiles('src/app/component/BlankComponent.tsx', REACT_DIR, FIXTURES_DIR);

    await rimraf(`${COMPONENT_DIR}/*`);

    await generate('react-typescript', 'blank-component',
      opts(COMPONENT_DIR, answers.blankComponentLowCase, modelPath));

    assertFiles('src/app/component/BlankComponent.tsx', REACT_DIR, FIXTURES_DIR);
  });

  it('should generate React client entity-cards', async function () {

    await rimraf(`${CARDS_DIR}/*`);

    await generate('react-typescript', 'entity-cards',
      opts(CARDS_DIR, answers.entityCards, modelPath));

    assertFiles('src/app/entity-cards/MpgFavoriteCarCards.tsx', REACT_DIR, FIXTURES_DIR);
  });

  it('should generate React client entity-management', async function () {

    await rimraf(`${EM_DIR}/*`);

    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement, modelPath));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement2, modelPath));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagement3, modelPath));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, answers.entityManagementLowCase, modelPath));
    await generate('react-typescript', 'entity-management',
      opts(EM_DIR, stringIdAnswers, modelPathScr));

    assertFiles('src/app/entity-management/CarCards.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarEdit.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarList.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarTable.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarManagement.tsx', REACT_DIR, FIXTURES_DIR);

    assertFiles('src/app/entity-management/CarManagementLowCase.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarEditLowCase.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/CarTableLowCase.tsx', REACT_DIR, FIXTURES_DIR);

    assertFiles('src/app/entity-management/StringIdMgtTableManagement.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/StringIdMgtTableEdit.tsx', REACT_DIR, FIXTURES_DIR);
    assertFiles('src/app/entity-management/StringIdMgtTableBrowse.tsx', REACT_DIR, FIXTURES_DIR);
  });

});



