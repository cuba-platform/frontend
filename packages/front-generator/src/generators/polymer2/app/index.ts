import {ProjectInfo} from "../../../common/model/cuba-model";
import {Polymer2AppTemplateModel} from "./template-model";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {BaseGenerator, readProjectModel} from "../../../common/generation";
import {questions} from "./questions";
import through2 = require("through2");

interface Answers {
  project: ProjectInfo
}

export function createPolymer2AppGenerator(templateDir = path.join(__dirname, 'template')) {

  class Polymer2AppGenerator extends BaseGenerator<Answers, Polymer2AppTemplateModel, CommonGenerationOptions> {

    constructor(args: string | string[], options: CommonGenerationOptions) {
      super(args, options);
      this.registerTransformStream(createRenameTransform(this));
      this.sourceRoot(templateDir);
    }

    // noinspection JSUnusedGlobalSymbols
    async prompting() {
      if (this.options.model) {
        this.conflicter.force = true;
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
      this.fs.copyTpl(this.templatePath('.package-lock.json'), this.destinationPath('package-lock.json'), this.model);
      this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    }

    end() {
      this.log(`CUBA Polymer client has been successfully generated into ${this.destinationRoot()}`);
    }
  }


  function createModel(project: ProjectInfo): Polymer2AppTemplateModel {
    return {
      generatorPackageVersion: process.env.npm_package_version || '0.2.0',
      title: project.name,
      project: project,
      basePath: project.modulePrefix +'-front',
      baseColor: '#2196F3',
      genClassName: function (suffix: string) {
        return project.namespace[0].toUpperCase() + project.namespace.slice(1) + suffix;
      }
    };
  }

  function createRenameTransform(generator: Polymer2AppGenerator) {
    return through2.obj(function (file, enc, callback) {
      file.basename = file.basename.replace('${project_namespace}', generator.model!.project.namespace);
      this.push(file);
      callback();
    });
  }

  return Polymer2AppGenerator;
}

export const generator = createPolymer2AppGenerator();
export {commonGenerationOptionsConfig as options};
export const params = [];