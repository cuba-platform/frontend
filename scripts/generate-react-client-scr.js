const gen = require('./generate-client-scr');

const clientDir = 'react-client-scr';
const answers = require('./model/react-client-scr-answers');
const intIdentityIdCardsConfig = require('./screens/int-identity-id-cards.json');
const intIdentityIdManagementTableConfig = require('./screens/int-identity-id-management-table.json');
const intIdentityIdManagementCardsConfig = require('./screens/int-identity-id-management-cards.json');
const intIdentityIdManagementListConfig = require('./screens/int-identity-id-management-list.json');
const intIdManagementTableConfig = require('./screens/int-id-management-table.json');
const intIdManagementCardsConfig = require('./screens/int-id-management-cards.json');
const intIdManagementListConfig = require('./screens/int-id-management-list.json');
const dirShift = '../../';

gen(
    'React client SCR',
    clientDir,
    'scripts/model/projectModel-scr.json',
    [
      { command: 'react-typescript:app' },
      {
        command: 'react-typescript:entity-cards',
        dirShift,
        dest: 'src/app/entity-cards',
        answers: answers.entityCards
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/entity-management',
        answers: answers.entityManagement
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/entity-management2',
        answers: answers.entityManagement2
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/entity-management3',
        answers: answers.entityManagement3
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/datatypes-test1',
        answers: answers.datatypesTest1
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/datatypes-test2',
        answers: answers.datatypesTest2
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/datatypes-test3',
        answers: answers.datatypesTest3
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/associationO2O',
        answers: answers.associationO2O
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/associationO2M',
        answers: answers.associationO2M
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/associationM2O',
        answers: answers.associationM2O
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/associationM2M',
        answers: answers.associationM2M
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/compositionO2O',
        answers: answers.compositionO2O
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/compositionO2M',
        answers: answers.compositionO2M
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/datatypes2',
        answers: answers.datatypes2Test
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/datatypes3',
        answers: answers.datatypes3Test
      },
      {
        command: 'react-typescript:entity-cards',
        dirShift,
        dest: 'src/app/datatypes-test-cards',
        answers: answers.datatypesTestCards
      },
      {
        command: 'react-typescript:entity-cards',
        dirShift,
        dest: 'src/app/int-id-cards',
        answers: intIdentityIdCardsConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-id-management-table',
        answers: intIdManagementTableConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-id-management-cards',
        answers: intIdManagementCardsConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-id-management-list',
        answers: intIdManagementListConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-identity-id-management-table',
        answers: intIdentityIdManagementTableConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-identity-id-management-cards',
        answers: intIdentityIdManagementCardsConfig
      },
      {
        command: 'react-typescript:entity-management',
        dirShift,
        dest: 'src/app/int-identity-id-management-list',
        answers: intIdentityIdManagementListConfig
      }
    ]
);
