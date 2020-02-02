import {writeComponentI18nMessages} from '../../../../generators/react-typescript/common/i18n';
import {expect, use} from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

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

  it('should merge and write i18n messages', function () {

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

    writeComponentI18nMessages(fs, 'testClass', './directory/shift', enTemplate, ruTemplate);

    expect(writeJSON).calledWith(expectEnPath, enExpected);
    expect(writeJSON).calledWith(expectRuPath, ruExpected);
  });

  it('should not call write method, if no rows are added', function () {

    const readJSON = sinon.stub();
    fs.readJSON = readJSON;

    readJSON.withArgs(expectRuPath).returns(ruExisting);
    // case where all keys, include 'router.*' already exist in file and have the same values
    readJSON.withArgs(expectEnPath).returns({'router.testClass':'Test Class', ...enExisting});

    writeComponentI18nMessages(fs, 'testClass', './directory/shift');
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    let enJson = { 'key1': 'predefined value 1'};
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', enJson);
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    writeComponentI18nMessages(fs, 'testClass', './directory/shift', enExisting, ruExisting);
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectEnPath);

    readJSON.withArgs(expectEnPath).returns({'router.testClass':'Test Class', ...enExisting});

    enJson = { 'key1': 'new value 1'};
    writeComponentI18nMessages(fs, 'testClass', './directory/shift', enJson);
    expect(writeJSON).not.calledWith(expectRuPath);
    expect(writeJSON).not.calledWith(expectRuPath);
  });

});

