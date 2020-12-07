const packClientLibs = require('./pack-client-libs');

packClientLibs(
    [
        '@haulmont/jmix-front-generator',
        '@haulmont/jmix-rest',
        '@haulmont/jmix-react-core',
        '@haulmont/jmix-react-ui'
    ],
    [
        '@haulmont/jmix-rest',
        '@haulmont/jmix-react-core',
        '@haulmont/jmix-react-ui'
    ]
);

