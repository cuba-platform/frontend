import {writeI18nMessages} from '../../../../generators/react-typescript/common/i18n';
import {expect, use} from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import {MemFsEditor} from "yeoman-generator";

use(sinonChai);

const writeJSON = sinon.fake();
const readJSON = sinon.fake();
const fs: MemFsEditor = {readJSON, writeJSON} as any;

const expectEnPath = 'directory/shift/i18n/en.json';
const expectRuPath = 'directory/shift/i18n/ru.json';

describe('i18n generation', () => {

  it('should write i18n messages when message files are empty', () => {

    writeI18nMessages(fs, "componentClassName", './directory/shift');

    expect(readJSON).calledWith(expectRuPath);
    expect(readJSON).calledWith(expectEnPath);

    expect(writeJSON).calledWith(expectRuPath, {});
    expect(writeJSON).calledWith(
      expectEnPath, {'router.componentClassName': 'componentClassName'});
  });

  it('should merge and write i18n messages', function () {

    const enExisting = {
      'key1': 'predefined value 1',
      'key3': 'predefined value 3',
      'keyNotInTemplate': 'key not in template'
    };

    const enTemplate = {
      'key1': 'template value 1',
      'key2': 'template value 2',
      'key3': 'template value 3',
      'key4': 'template value 4',
      'key5': 'template value 5',
    };

    const ruExisting = {
      'key1': 'заранее заданное значение 1',
      'key3': 'заранее заданное значение 3',
      'key4': 'заранее заданное значение 4',
      'keyNotInTemplate': 'ключ, отсутствующий в шаблоне'
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
      'router.testClass': 'testClass',
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

    writeI18nMessages(fs, 'testClass', './directory/shift', enTemplate, ruTemplate);

    expect(writeJSON).calledWith(expectEnPath, enExpected);
    expect(writeJSON).calledWith(expectRuPath, ruExpected);
  });

});

