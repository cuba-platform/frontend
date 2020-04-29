import {ProjectInfo} from "../../../common/model/cuba-model";
import {BaseGenerator, readProjectModel} from "../../../common/base-generator";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";

import {
  ERR_STUDIO_NOT_CONNECTED,
  exportProjectModel,
  getOpenedCubaProjects,
  StudioProjectInfo
} from "../../../common/studio/studio-integration";
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
    if (!openedCubaProjects || openedCubaProjects.length < 1) {
      this.env.error(Error(ERR_STUDIO_NOT_CONNECTED));
      return;
    }

    this.answers = await this.prompt([{
      name: 'projectInfo',
      type: 'list',
      message: 'Please select CUBA project you want to use for generation',
      choices: openedCubaProjects && openedCubaProjects.map(p => ({
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

      // TODO exportProjectModel is resolved before the file is created. Timeout is a temporary workaround.
      await new Promise(resolve => setTimeout(resolve, 2000));

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
    this.log(`Generate SDK model and services to ${sdkDest}`);

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
