"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const program = commander;
program
    .version('0.1.0', '-v, --version')
    .parse(process.argv);
