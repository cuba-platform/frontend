import * as Base from "yeoman-generator";
import {Questions} from "yeoman-generator";
import * as path from "path";
import {ProjectInfo} from "../../../common/model";
import {QuestionType} from "../../../common/inquirer";
import {Polymer2AppTemplateModel} from "./template-model";
import through2 = require("through2");
import {Polymer2AppGeneratorOptions, options as availableOptions} from "./options";


class Polymer2AppGenerator extends Base {

  options: Polymer2AppGeneratorOptions = {};
  props?: { project: ProjectInfo };

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
    const questions: Questions = [{
      name: 'name',
      message: 'Project Name',
      type: QuestionType.input,
      validate(input) {
        if (!input || input.length < 1) {
          return 'must be at least 1 symbols'
        }
        return true;
      }
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

    this.props = {project: await this.prompt(questions) as ProjectInfo};
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.props) {
      return;
    }

    const templateModel: Polymer2AppTemplateModel = answersToModel(this.props.project);

    this.fs.copy(this.templatePath() + '/images/**', this.destinationPath('images'));
    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), templateModel);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), templateModel);
  }

  end() {
    this.log(`CUBA Polymer client has been successfully generated into ${this.destinationRoot()}`);
  }

  private _getDestRoot(): string {
    const subDir = this.options.dest ? this.options.dest : '';
    return path.join(this.destinationRoot(), subDir)
  }
}


function answersToModel(project: ProjectInfo): Polymer2AppTemplateModel {
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
    file.basename = file.basename.replace('${project_namespace}', generator.props!.project.namespace);
    this.push(file);
    callback();
  });
}

export = Polymer2AppGenerator;