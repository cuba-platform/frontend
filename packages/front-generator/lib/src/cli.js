"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const init_1 = require("./init");
const cli = commander;
cli.version(require('../package').version, '-v, --version');
function initCommands(cli) {
    return __awaiter(this, void 0, void 0, function* () {
        const generators = yield init_1.collectGenerators();
        generators.forEach(generator => {
            cli
                .command(`${generator.name}`)
                .action(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield init_1.generate(generator);
                });
            });
        });
    });
}
initCommands(cli).then(() => {
    cli.parse(process.argv);
    if (!process.argv.slice(2).length) {
        cli.outputHelp();
    }
});
//# sourceMappingURL=cli.js.map