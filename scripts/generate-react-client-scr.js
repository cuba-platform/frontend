const gen = require('./generate-client-scr');

const clientDir = 'react-client-scr';
const answers = require('./model/react-client-scr-answers');
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
        command: 'react-typescript:entity-cards',
        dirShift,
        dest: 'src/app/datatypes-test-cards',
        answers: answers.datatypesTestCards
      },
    ]
);
