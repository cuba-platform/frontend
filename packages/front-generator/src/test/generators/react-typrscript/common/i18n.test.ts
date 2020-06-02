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

  const frExisting = {
    'key1': 'valeur prédéfinie 1',
    'key3': 'valeur prédéfinie 3',
    'keyNotInTemplate': 'Clé absent du modèle'
  };

  const frTemplate = {
    'key1': 'valeur prédéfinie 1',
    'key2': 'valeur prédéfinie 2',
    'key3': 'valeur prédéfinie 3',
    'key4': 'valeur prédéfinie 4',
    'key5': 'valeur prédéfinie 5',
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

  const frExpected = {
    'key1': 'valeur prédéfinie 1',
    'key2': 'valeur prédéfinie 2',
    'key3': 'valeur prédéfinie 3',
    'key4': 'valeur prédéfinie 4',
    'key5': 'valeur prédéfinie 5',
    'router.testClass': 'classeTest',
    'keyNotInTemplate': 'Clé absent du modèle'
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
    const {enOut, ruOut,frOut} = mergeI18nMessages(enExisting, enTemplate, ruExisting, ruTemplate,frExisting, frTemplate, 'testClass');

    expect(enOut).to.deep.equal(enExpected);
    expect(ruOut).to.deep.equal(ruExpected);
    expect(frOut).to.deep.equal(frExpected);
  });
});
