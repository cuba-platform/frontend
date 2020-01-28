const packClientLibs = require('./pack-client-libs');

packClientLibs(
    [
        '@cuba-platform/frontend-generator',
        '@cuba-platform/rest',
        '@cuba-platform/react-core',
        '@cuba-platform/react-ui'
    ],
    [
        '@cuba-platform/rest',
        '@cuba-platform/react-core',
        '@cuba-platform/react-ui'
    ]
);

