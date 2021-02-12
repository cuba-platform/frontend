import {writeComponentI18nMessages, SUPPORTED_CLIENT_LOCALES} from '../../../../generators/react-typescript/common/i18n';
import {expect, use} from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {Locale} from '../../../../common/model/cuba-model';

use(sinonChai);

const expectEnPath = 'directory/shift/i18n/en.json';
const expectRuPath = 'directory/shift/i18n/ru.json';

const enExisting = {
  'key1': 'predefined value 1',
  'key3': 'predefined value 3',
  'keyNotInTemplate': 'key not in template'
};

const ruExisting = {
  'key1': 'заранее заданное значение 1',
  'key3': 'заранее заданное значение 3',
  'key4': 'заранее заданное значение 4',
  'keyNotInTemplate': 'ключ, отсутствующий в шаблоне'
};

let fs: any;
let writeJSON: any;

describe('i18n generation', () => {

  beforeEach(() => {
    writeJSON = sinon.fake();
    fs = {writeJSON} as any;
  });

  it('should write i18n messages when message files are empty', () => {

    const readJSON = sinon.stub();
    fs.readJSON = readJSON;

    readJSON.returns(null);
    writeComponentI18nMessages(fs, "componentClassName", './directory/shift');

    expect(readJSON).calledWith(expectRuPath);
    expect(readJSON).calledWith(expectEnPath);

    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).calledWith(
      expectEnPath, {'router.componentClassName': 'Component Class Name'});

    readJSON.returns({});
    writeComponentI18nMessages(fs, "componentClassName", './directory/shift');

    expect(readJSON).calledWith(expectRuPath);
    expect(readJSON).calledWith(expectEnPath);

    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).calledWith(
      expectEnPath, {'router.componentClassName': 'Component Class Name'});
  });

  it('should merge and write i18n messages', () => {

    const enTemplate = {
      'key1': 'template value 1',
      'key2': 'template value 2',
      'key3': 'template value 3',
      'key4': 'template value 4',
      'key5': 'template value 5',
    };

    const ruTemplate = {
      'key1': 'значение из шаблона 1',
      'key2': 'значение из шаблона 2',
      'key3': 'значение из шаблона 3',
      'key4': 'значение из шаблона 4',
      'key5': 'значение из шаблона 5',
    };

    const enExpected = {
      'key1': 'predefined value 1',
      'key2': 'template value 2',
      'key3': 'predefined value 3',
      'key4': 'template value 4',
      'key5': 'template value 5',
      'router.testClass': 'Test Class',
      'keyNotInTemplate': 'key not in template'
    };

    const ruExpected = {
      'key1': 'заранее заданное значение 1',
      'key2': 'значение из шаблона 2',
      'key3': 'заранее заданное значение 3',
      'key4': 'заранее заданное значение 4',
      'key5': 'значение из шаблона 5',
      'keyNotInTemplate': 'ключ, отсутствующий в шаблоне'
    };

    const readJSON = sinon.stub();
    readJSON.withArgs(expectEnPath).returns(enExisting);
    readJSON.withArgs(expectRuPath).returns(ruExisting);
    fs.readJSON = readJSON;

    writeComponentI18nMessages(fs, 'testClass', './directory/shift', undefined, {
      en: enTemplate,
      ru: ruTemplate
    });

    expect(writeJSON).calledWith(expectEnPath, enExpected);
    expect(writeJSON).calledWith(expectRuPath, ruExpected);
  });

  it('should not call write method, if no rows are added', () => {

    const readJSON = sinon.stub();
    fs.readJSON = readJSON;

    readJSON.withArgs(expectRuPath).returns(ruExisting);
    // case where all keys, include 'router.*' already exist in file and have the same values
    readJSON.withArgs(expectEnPath).returns({'router.testClass':'Test Class', ...enExisting});

    writeComponentI18nMessages(fs, 'testClass', './directory/shift');
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    let enJson = { 'key1': 'predefined value 1'};
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', undefined, {en: enJson});
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    writeComponentI18nMessages(fs, 'testClass', './directory/shift', undefined, {
      en: enExisting,
      ru: ruExisting
    });
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    readJSON.withArgs(expectEnPath).returns({'router.testClass':'Test Class', ...enExisting});

    enJson = { 'key1': 'new value 1'};
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', undefined, {en: enJson});
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectRuPath);
  });

});

describe('i18n generation - project locales', () => {
  const messages = {
    en: { 'key0': 'new value 0'},
    ru: { 'key0': 'новое значение 0'}
  };
  const enLocale: Locale = {code: 'en', caption: 'English'};
  const ruLocale: Locale = {code: 'ru', caption: 'Русский'};
  const projectLocalesEnRu = [enLocale, ruLocale];
  const projectLocalesEn = [enLocale];
  const projectLocalesRu = [ruLocale];

  beforeEach(() => {
    writeJSON = sinon.fake();
    fs = {writeJSON} as any;
    const readJSON = sinon.stub();
    readJSON.withArgs(expectEnPath).returns(enExisting);
    readJSON.withArgs(expectRuPath).returns(ruExisting);
    fs.readJSON = readJSON;
  });

  it('should write en and ru messages if the project contains both locales', () => {
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', projectLocalesEnRu, messages);
    expect(writeJSON).calledWith(expectEnPath);
    expect(writeJSON).calledWith(expectRuPath);
  });

  it('should only write en messages if the project only contains en locale', () => {
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', projectLocalesEn, messages);
    expect(writeJSON).calledWith(expectEnPath);
    expect(writeJSON).not.calledWith(expectRuPath);
  });

  it('should only write ru messages if the project only contains ru locale', () => {
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', projectLocalesRu, messages);
    expect(writeJSON).not.calledWith(expectEnPath);
    expect(writeJSON).calledWith(expectRuPath);
  });

  it('should write both en and ru messages if the project locales are unknown', () => {
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', undefined, messages);
    expect(writeJSON).calledWith(expectEnPath);
    expect(writeJSON).calledWith(expectRuPath);
  });
});

describe('i18n message packs', async () => {
  it('has the same keys', async () => {
    for (const locale of SUPPORTED_CLIENT_LOCALES) {
      const appMessagePack =
        await import(`../../../../generators/react-typescript/app/template/i18n-message-packs/${locale}.json`);
      const entityManagementMessagePack =
        await import(`../../../../generators/react-typescript/entity-management/entity-management-${locale}.json`);
      const mergedMessagePack = {...appMessagePack, ...entityManagementMessagePack};
      const keys = Object.keys(mergedMessagePack);
      expect(keys.length).to.equal(ALL_I18N_KEYS.length, `Number of keys is mismatched for locale ${locale}`);
      keys.forEach((key) => {
        expect(ALL_I18N_KEYS.includes(key), `${locale} does not include key ${key}`).to.be.true;
      });
    }
  });
});

const ALL_I18N_KEYS = [
  // Main message pack
  "common.ok",
  "common.cancel",
  "common.create",
  "common.edit",
  "common.remove",
  "common.submit",
  "common.unsavedEntity",
  "common.requestFailed",
  "common.retry",
  "home.welcome",
  "router.home",
  "login.failed",
  "login.placeholder.login",
  "login.placeholder.password",
  "login.loginBtn",
  "header.logout.areYouSure",
  "header.logout.ok",
  "header.logout.cancel",
  "cubaReact.dataTable.clearAllFilters",
  "cubaReact.dataTable.validation.requiredField",
  "cubaReact.dataTable.validation.uuid",
  "cubaReact.dataTable.failedToLoadNestedEntities",
  "cubaReact.dataTable.loading",
  "cubaReact.dataTable.operator.startsWith",
  "cubaReact.dataTable.operator.endsWith",
  "cubaReact.dataTable.operator.contains",
  "cubaReact.dataTable.operator.doesNotContain",
  "cubaReact.dataTable.operator.in",
  "cubaReact.dataTable.operator.notIn",
  "cubaReact.dataTable.operator.notEmpty",
  "cubaReact.dataTable.operator.inInterval",
  "cubaReact.dataTable.yes",
  "cubaReact.dataTable.no",
  "cubaReact.dataTable.ok",
  "cubaReact.dataTable.reset",
  "cubaReact.dataTable.add",
  "cubaReact.dataTable.intervalEditor.last",
  "cubaReact.dataTable.intervalEditor.next",
  "cubaReact.dataTable.intervalEditor.predefined",
  "cubaReact.dataTable.intervalEditor.today",
  "cubaReact.dataTable.intervalEditor.yesterday",
  "cubaReact.dataTable.intervalEditor.tomorrow",
  "cubaReact.dataTable.intervalEditor.lastMonth",
  "cubaReact.dataTable.intervalEditor.thisMonth",
  "cubaReact.dataTable.intervalEditor.nextMonth",
  "cubaReact.dataTable.intervalEditor.days",
  "cubaReact.dataTable.intervalEditor.hours",
  "cubaReact.dataTable.intervalEditor.minutes",
  "cubaReact.dataTable.intervalEditor.months",
  "cubaReact.dataTable.intervalEditor.includingCurrent",
  "cubaReact.dataTable.listEditor.addItem",
  "cubaReact.file.downloading",
  "cubaReact.file.downloadFailed",
  "cubaReact.fileUpload.replace",
  "cubaReact.fileUpload.upload",
  "cubaReact.fileUpload.uploadFailed",
  "cubaReact.imagePreview.title",
  "cubaReact.imagePreview.alt",
  "cubaReact.imagePreview.close",
  "cubaReact.imagePreview.download",
  "cubaReact.nestedEntityField.create",
  "cubaReact.nestedEntityField.delete.areYouSure",
  "cubaReact.nestedEntitiesTableField.delete.areYouSure",
  "antd.form.validation.default",
  "antd.form.validation.required",
  "antd.form.validation.enum",
  "antd.form.validation.whitespace",
  "antd.form.validation.date.format",
  "antd.form.validation.date.parse",
  "antd.form.validation.date.invalid",
  "antd.form.validation.types.string",
  "antd.form.validation.types.method",
  "antd.form.validation.types.array",
  "antd.form.validation.types.object",
  "antd.form.validation.types.number",
  "antd.form.validation.types.date",
  "antd.form.validation.types.boolean",
  "antd.form.validation.types.integer",
  "antd.form.validation.types.float",
  "antd.form.validation.types.regexp",
  "antd.form.validation.types.email",
  "antd.form.validation.types.url",
  "antd.form.validation.types.hex",
  "antd.form.validation.string.len",
  "antd.form.validation.string.min",
  "antd.form.validation.string.max",
  "antd.form.validation.string.range",
  "antd.form.validation.number.len",
  "antd.form.validation.number.min",
  "antd.form.validation.number.max",
  "antd.form.validation.number.range",
  "antd.form.validation.array.len",
  "antd.form.validation.array.min",
  "antd.form.validation.array.max",
  "antd.form.validation.array.range",
  "antd.form.validation.pattern.mismatch",

  // Entity management
  "management.browser.delete.areYouSure",
  "management.browser.delete.ok",
  "management.browser.noItems",
  "management.editor.validationError",
  "management.editor.success",
  "management.editor.error",
];