import * as Base from "yeoman-generator";
import {Questions} from "yeoman-generator";
import * as path from "path";
import {ProjectInfo} from "../../../common/model";
import {QuestionType} from "../../../common/inquirer";
import {Polymer2AppTemplateModel} from "./template-model";
import through2 = require("through2");
import {Polymer2AppGeneratorOptions, options as availableOptions} from "./cli-options";


class Polymer2AppGenerator extends Base {

  options: Polymer2AppGeneratorOptions = {};
  answers?: { project: ProjectInfo };
  model?: Polymer2AppTemplateModel;

  constructor(args: string | string[], options: Polymer2AppGeneratorOptions) {
    super(args, options);

    Object.keys(availableOptions).forEach(optionName => {
      this.option(optionName, availableOptions[optionName]);
    });

    this.sourceRoot(path.join(__dirname, 'template'));
    this.destinationRoot(this._getDestRoot());
    this.registerTransformStream(rename(this));
  }


  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    if (this.options.model) {
      this.log('Skipping prompts since model provided');
      return;
    }
    const questions: Questions = [{
      name: 'name',
      message: 'Project Name',
      type: QuestionType.input
    },{
      name: 'modulePrefix',
      message: 'Module Prefix',
      type: QuestionType.input,
      'default': 'app'
    }, {
      name: 'namespace',
      message: 'Project Namespace',
      type: QuestionType.input
    }, {
      name: 'locales',
      message: 'Locales',
      type: QuestionType.checkbox,
      choices: [{
        name: 'English',
        value: 'en',
        checked: true
      }, {
        name: 'Russian',
        value: 'ru'
      }]
    }];

    this.answers = {project: await this.prompt(questions) as ProjectInfo};
  }

  prepareModel() {
    if (this.options.model) {
      this.model = {} as Polymer2AppTemplateModel //todo VM read model
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

  private _getDestRoot(): string {
    const subDir = this.options.dest ? this.options.dest : '';
    return path.join(this.destinationRoot(), subDir)
  }
}


function createModel(project: ProjectInfo): Polymer2AppTemplateModel {
  return {
    title: project.name,
    project: project,
    basePath: 'app-front',
    baseColor: '#2196F3',
    genClassName: function(suffix:string) {
      return project.namespace[0].toUpperCase() + project.namespace.slice(1) + suffix;
    }
  };
}

function rename(generator: Polymer2AppGenerator) {
  return through2.obj(function (file, enc, callback) {
    file.basename = file.basename.replace('${project_namespace}', generator.model!.project.namespace);
    this.push(file);
    callback();
  });
}

export = Polymer2AppGenerator;