import {ProjectInfo} from "../../../common/model/cuba-model";
import {BaseGenerator, readProjectModel} from "../../../common/generation";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";

import {exportProjectModel, getOpenedCubaProjects, StudioProjectInfo} from "../../../common/studio/studio-integration";
import {ownVersion} from "../../../cli";
import {SdkAllGenerator} from "../../sdk/sdk-generator";

interface TemplateModel {
  title: string;
  basePath: string;
  project: ProjectInfo;
  ownVersion: string;
}

interface Answers {
  projectInfo: StudioProjectInfo;
}

class ReactTSAppGenerator extends BaseGenerator<Answers, TemplateModel, CommonGenerationOptions> {

  conflicter!: { force: boolean }; //missing in typings
  modelPath?: string;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
    this.modelPath = this.options.model;
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async prompting() {
    if (this.options.model) {
      this.conflicter.force = true;
      this.log('Skipping prompts since model provided');
      this.cubaProjectModel = readProjectModel(this.options.model);
      return;
    }

    const openedCubaProjects = await getOpenedCubaProjects();
    if (openedCubaProjects.length < 1) {
      this.env.error(Error("Please open Cuba Studio Intellij and enable Old Studio integration"));
    }

    this.answers = await this.prompt([{
      name: 'projectInfo',
      type: 'list',
      message: 'Please select CUBA project you want use for generation',
      choices: openedCubaProjects.map(p => ({
        name: `${p.name} [${p.path}]`,
        value: p
      }))
    }]) as Answers;

  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async prepareModel() {
    if (this.cubaProjectModel) {
      this.model = createModel(this.cubaProjectModel.project);
    } else if (this.answers) {
      this.modelPath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(this.answers.projectInfo.locationHash, this.modelPath);
      this.cubaProjectModel = readProjectModel(this.modelPath);
      this.model = createModel(this.cubaProjectModel.project);
    }
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);

    if (!this.model) {
      throw new Error('Model is not provided');
    }

    this.fs.copyTpl(this.templatePath() + '/public/**', this.destinationPath('public'), this.model);
    this.fs.copyTpl(this.templatePath() + '/src/**', this.destinationPath('src'), this.model);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.model);
    this.fs.copyTpl(this.templatePath('.env.production.local'), this.destinationPath('.env.production.local'), this.model);
    this.fs.copyTpl(this.templatePath('.env.development.local'), this.destinationPath('.env.development.local'), this.model);
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'));
  }

  // noinspection JSUnusedGlobalSymbols - yeoman runs all methods from class
  async generateSdk() {
    const sdkDest = 'src/cuba';
    this.log(`Generate sdk model and services to ${sdkDest}`);

    const sdkOpts = {
      model: this.modelPath,
      dest: sdkDest
    };

    const generatorOpts = {
      Generator: SdkAllGenerator,
      path: require.resolve('../../sdk/sdk-generator')
    };

    //todo type not match
    await this.composeWith(generatorOpts as any, sdkOpts);
  }

  end() {
    this.log(`CUBA React client has been successfully generated into ${this.destinationRoot()}`);
  }
}


function createModel(project: ProjectInfo): TemplateModel {
  return {
    ownVersion,
    title: project.name,
    project: project,
    basePath: project.modulePrefix + '-front'
  };
}

export const generator = ReactTSAppGenerator;
export const options = commonGenerationOptionsConfig;
export const params = [];