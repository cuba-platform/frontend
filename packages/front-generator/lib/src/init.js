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
const YeomanEnvironment = require("yeoman-environment");
const path = require("path");
const GENERATORS_DIR = 'packages/@cuba-platform';
const GENERATOR_COMMON_PREFIX = 'generator-cuba-';
const GENERATOR_COMMON_SUFFIX = '-front';
function collectGenerators() {
    return __awaiter(this, void 0, void 0, function* () {
        const dirs = yield util_1.promisify(fs_1.readdir)(GENERATORS_DIR);
        return dirs
            .filter(dirName => dirName.startsWith(GENERATOR_COMMON_PREFIX))
            .map(dirName => {
            return {
                name: extractName(dirName),
                bundled: true
            };
        });
    });
}
exports.collectGenerators = collectGenerators;
function generate(generatorInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const env = new YeomanEnvironment();
        const generator = require.resolve(path.join(GENERATORS_DIR, fromName(generatorInfo.name)));
        env.registerStub(generator, "cuba:generator");
        console.log('generated');
    });
}
exports.generate = generate;
function extractName(dirName) {
    return dirName.replace(GENERATOR_COMMON_PREFIX, '').replace(GENERATOR_COMMON_SUFFIX, '');
}
function fromName(name) {
    return GENERATOR_COMMON_PREFIX + name + GENERATOR_COMMON_SUFFIX;
}
//# sourceMappingURL=init.js.map