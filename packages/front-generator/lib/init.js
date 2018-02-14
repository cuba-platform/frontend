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
const YeomanEnvironment = require("yeoman-environment");
const path = require("path");
const GENERATORS_DIR = 'generators';
function collectGenerators() {
    return scanDir(path.join(__dirname, GENERATORS_DIR));
}
exports.collectGenerators = collectGenerators;
function collectSubGenerators(generatorName) {
    return scanDir(path.join(__dirname, GENERATORS_DIR, generatorName));
}
exports.collectSubGenerators = collectSubGenerators;
function generate(generatorName, subgeneratorName) {
    return __awaiter(this, void 0, void 0, function* () {
        const env = new YeomanEnvironment();
        const generator = require(path.join(__dirname, GENERATORS_DIR, generatorName, subgeneratorName, 'index'));
        env.registerStub(generator, generator.name);
        env.run(generator.name);
    });
}
exports.generate = generate;
function scanDir(generatorsDir) {
    const dirs = fs_1.readdirSync(generatorsDir);
    return dirs.map(dirName => {
        return {
            name: dirName,
            bundled: true
        };
    });
}
//# sourceMappingURL=init.js.map