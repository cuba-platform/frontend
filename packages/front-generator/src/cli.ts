import * as commander from "commander";

const program = commander;

program
    .version('0.1.0', '-v, --version')
    .parse(process.argv);