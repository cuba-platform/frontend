const gen = require('./generate-client-scr');
const answers = require('./model/react-client-scr-answers');

gen(
    'React Native client SCR',
    'react-native-client-scr',
    'scripts/model/projectModel-scr.json',
    [
        {
          command: 'react-native:app',
          answers: answers.app
        }
    ]
);
