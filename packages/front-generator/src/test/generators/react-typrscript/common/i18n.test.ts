import {mergeI18nMessages} from '../../../../generators/react-typescript/common/i18n';
import { expect } from 'chai';

describe('react generator helpers', () => {
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

  it('should add i18n keys without overwriting', () => {
    const {enOut, ruOut} = mergeI18nMessages(enExisting, enTemplate, ruExisting, ruTemplate, 'testClass');

    expect(enOut).to.deep.equal(enExpected);
    expect(ruOut).to.deep.equal(ruExpected);
  });
});
