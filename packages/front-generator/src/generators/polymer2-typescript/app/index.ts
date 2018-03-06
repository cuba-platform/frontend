import {polymer2AppQuestions} from "../../polymer2/app/questions";
import {ProjectInfo, ProjectModel} from "../../../common/model";
import {Polymer2AppTemplateModel} from "../../polymer2/app/template-model";
import {BaseGenerator, CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-common";
import * as fs from "fs";
import * as through2 from "through2";
import * as path from "path";

class Polymer2TypescriptAppGenerator extends BaseGenerator {

  options: CommonGenerationOptions = {};
  answers?: { project: ProjectInfo };
  model?: Polymer2AppTemplateModel;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    this._populateOptions(commonGenerationOptionsConfig);

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
    this.answers = {project: await this.prompt(polymer2AppQuestions) as ProjectInfo};
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

    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), this.model);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.model);
  }

  end() {
    this.log(`CUBA Polymer client (TypeScript) has been successfully generated into ${this.destinationRoot()}`);
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

function createRenameTransform(generator: Polymer2TypescriptAppGenerator) {
  return through2.obj(function (file, enc, callback) {
    file.basename = file.basename.replace('${project_namespace}', generator.model!.project.namespace);
    this.push(file);
    callback();
  });
}

export = Polymer2TypescriptAppGenerator;