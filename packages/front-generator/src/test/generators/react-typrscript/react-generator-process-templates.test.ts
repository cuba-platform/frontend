import * as path from "path";
import * as Base from "yeoman-generator";
import * as YeomanEnvironment from "yeoman-environment";
import * as fs from 'fs';
import {promisify} from "util";
import {format} from '../../test-commons';
import * as assert from 'assert';

const rimraf = promisify(require('rimraf'));

const DEST_DIR = path.join(process.cwd(), `src/test/generated/templates`);
const DEST_EDITOR = path.join(DEST_DIR, 'EntityManagementEditor.tsx');
const FIXTURES_DIR = path.join(process.cwd(), `src/test/fixtures/templates`);


class CopyTplGenerator extends Base {

  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, '../../../generators/react-typescript/entity-management/template'));
  }

  // noinspection JSUnusedGlobalSymbols
  processTemplate() {

    const fields = [
      {
        name: 'manufacturer',
        mandatory: true
      },
      {name: 'model'},
      {
        name: 'wheelOnRight',
        type: {fqn: 'java.lang.Boolean'}
      },
      {name: 'garage'}
    ];

    const model = {
      editComponentName: "CarEdit",
      listComponentName: "CarCards",
      className: "CarManagement",
      editAssociations: {
        garage: {className: 'Garage', path: 'cuba/entities/scr$Garage'}
      },
      editCompositions: {},
      relationImports: [
        {className: 'Car', path: 'cuba/entities/scr$Car'},
        {className: 'Garage', path: 'cuba/entities/scr$Garage'}],
      relDirShift: '../../',
      entity: {className: 'Car', path: 'cuba/entities/scr$Car'},
      editView: {name: 'car-edit', allProperties: fields},
      editAttributes: fields
    };

    const tplPath = this.templatePath('EntityManagementEditor.tsx.ejs');
    console.log('process template tplPath', fs.realpathSync(tplPath));
    console.log('dest dir', fs.realpathSync(DEST_DIR));
    this.fs.copyTpl(tplPath, DEST_EDITOR, model);
  }

}


describe('react generator template processing test', () => {

  it('should process entity management editor ejs template', async () => {

    await rimraf(`${DEST_DIR}/*`);
    !fs.existsSync(DEST_DIR) && fs.mkdirSync(DEST_DIR, {recursive: true});

    const env = new YeomanEnvironment();
    env.registerStub(CopyTplGenerator, 'CopyTplGenerator');
    await env.run('CopyTplGenerator', {});

    format(DEST_EDITOR);

    assert.strictEqual(fs.readFileSync(DEST_EDITOR, 'utf8'),
      fs.readFileSync(path.join(FIXTURES_DIR, 'EntityManagementEditor.tsx'), 'utf8'));
  });

});
