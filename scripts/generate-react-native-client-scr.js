const gen = require('./generate-client-scr');

gen(
    'React Native client SCR',
    'react-native-client-scr',
    'scripts/model/projectModel-scr-jmix.json',
    [
        { command: 'react-native:app' }
    ]
);
