import {ProjectInfo, ProjectModel} from "../../../common/cuba-model";
import {Polymer2AppTemplateModel} from "./template-model";
import * as fs from "fs";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {BaseGenerator, GeneratorExports, NonInteractiveGenerator} from "../../../common/generation";
import {questions} from "./questions";
import through2 = require("through2");
import {StudioTemplateProperty} from "../../../common/cuba-studio";


class Polymer2AppGenerator extends BaseGenerator implements NonInteractiveGenerator {

  answers?: { project: ProjectInfo };
  model?: Polymer2AppTemplateModel;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    this._populateOptions(this._getOptions());

    this.registerTransformStream(createRenameTransform(this));
    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(this._getDestRoot());
  }


  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    if (this.options.model) {
      this.log('Skipping prompts since model provided');
      return;
    }
    this.answers = {project: await this.prompt(questions) as ProjectInfo};
  }

  prepareModel() {
    if (this.options.model) {
      const projectModel = readProjectModel(this.options.model);
      this.model = createModel(projectModel.project);
    } else if (this.answers) {
      this.model = createModel(this.answers.project);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.model) {
      throw new Error('Model is not provided');
    }

    this.fs.copy(this.templatePath() + '/images/**', this.destinationPath('images'));
    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), this.model);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.model);
  }

  end() {
    this.log(`CUBA Polymer client has been successfully generated into ${this.destinationRoot()}`);
  }

  _getOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return [];
  }
}


function createModel(project: ProjectInfo): Polymer2AppTemplateModel {
  return {
    title: project.name,
    project: project,
    basePath: 'app-front',
    baseColor: '#2196F3',
    genClassName: function (suffix: string) {
      return project.namespace[0].toUpperCase() + project.namespace.slice(1) + suffix;
    }
  };
}

function readProjectModel(modelFilePath: string): ProjectModel {
  if (!fs.existsSync(modelFilePath)) {
    throw new Error('Specified model file does not exist');
  }
  return require(modelFilePath);
}

function createRenameTransform(generator: Polymer2AppGenerator) {
  return through2.obj(function (file, enc, callback) {
    file.basename = file.basename.replace('${project_namespace}', generator.model!.project.namespace);
    this.push(file);
    callback();
  });
}

export {Polymer2AppGenerator as generator};
export {commonGenerationOptionsConfig as options};
export const params = [];