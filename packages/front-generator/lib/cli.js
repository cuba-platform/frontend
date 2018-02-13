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
const generator_1 = require("./generator");
const cli = commander;
cli.version(require('../package').version, '-v, --version');
cli
    .command('client [clientType]')
    .description('Creates a new application by specified preset')
    .action(function (clientType) {
    return __awaiter(this, void 0, void 0, function* () {
        const localClients = yield generator_1.getLocalClients();
        const clientInfo = localClients.find(c => c.name === clientType);
        if (!clientInfo) {
            console.log(localClients.map(c => c.name));
            throw new Error('Please specify client type');
        }
        yield generator_1.generate(clientInfo);
    });
});
cli.parse(process.argv);
if (!process.argv.slice(2).length) {
    cli.outputHelp();
}
//# sourceMappingURL=cli.js.map