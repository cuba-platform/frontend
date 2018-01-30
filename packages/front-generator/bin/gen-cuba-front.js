#!/usr/bin/env node

'use strict';

process.title = 'gen-cuba-front';

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

require('../lib/cli');