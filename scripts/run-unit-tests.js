const {runCmdSync} = require('./common');

runCmdSync('lerna run test --scope @cuba-platform/react-ui ' +
    '&& lerna run coverage --scope {@cuba-platform/rest,@cuba-platform/front-generator}');
