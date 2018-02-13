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
const fs_1 = require("fs");
const util_1 = require("util");
const vfs = require("vinyl-fs");
const through2 = require("through2");
const CLIENTS_DIR = 'clients';
const clients = [];
function getLocalClients() {
    return __awaiter(this, void 0, void 0, function* () {
        const dirs = yield util_1.promisify(fs_1.readdir)(CLIENTS_DIR);
        return dirs.map(dirName => {
            return { name: dirName };
        });
    });
}
exports.getLocalClients = getLocalClients;
function generate(client) {
    return __awaiter(this, void 0, void 0, function* () {
        vfs
            .src([`./clients/${client.name}/base/**/*`])
            .pipe(through2.obj(function (file, end, callback) {
            callback(null, file);
        }))
            .pipe(vfs.dest('./.tmp'));
    });
}
exports.generate = generate;
//# sourceMappingURL=generator.js.map