import {CommonGenerationOptions} from "../../../common/cli-options";
import {YeomanGenerator} from "../../YeomanGenerator";
import * as path from "path";
import * as AutocompletePrompt from "inquirer-autocomplete-prompt";
import through2 = require('through2');
import prettier = require('prettier');

// Moved (almost) unchanged from src/common

export const defaultConfigureGenerator = <O extends CommonGenerationOptions>(templateDir: string, gen: YeomanGenerator, options: O) =>{
  const {dest} = options;
  if (dest != null) {
    gen.destinationRoot(path.isAbsolute(dest) ? dest : path.join(gen.destinationRoot(), dest));
  }

  gen.sourceRoot(templateDir);

  // @ts-ignore this.env.adapter is missing in the typings
  gen.env.adapter
    .promptModule.registerPrompt('autocomplete',  AutocompletePrompt);
  gen.registerTransformStream(createEjsRenameTransform());
  gen.registerTransformStream(createFormatTransform());

  if (options.answers || options.model) {
    gen.conflicter.force = true;
  }
}

/**
 * Transform stream for remove .ejs extension from files. We are using this extension to improve code
 * highlight in editor
 */
function createEjsRenameTransform() {
  return through2.obj(function (file, enc, callback) {

    file.basename = file.basename
      .replace(/.ts.ejs$/, '.ts')
      .replace(/.tsx.ejs$/, '.tsx');

    this.push(file);
    callback();
  });
}

/**
 * Prettier formatting transform stream for .ts and .tsx files
 */
function createFormatTransform() {
  return through2.obj(function (file, enc, callback) {

    if (file.path.endsWith('.ts') || file.path.endsWith('.tsx')) {
      const contents = Buffer.from(file.contents).toString('utf8');
      file.contents = Buffer.from(prettier.format(contents, {parser: "typescript"}));
    }

    this.push(file);
    callback();
  });
}