import {ProjectInfo} from "../../../common/model/cuba-model";
import {BaseGenerator, readProjectModel} from "../../../common/generation";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {generateEntities} from "../../../common/model/entities-generation";
import {exportProjectModel, getOpenedCubaProjects, StudioProjectInfo} from "../../../common/studio/studio-integration";

interface TemplateModel {
  title: string;
  basePath: string;
  project: ProjectInfo;
}

interface Answers {
  projectInfo: StudioProjectInfo;
}

class ReactTSAppGenerator extends BaseGenerator<Answers, TemplateModel, CommonGenerationOptions> {

  conflicter!: { force: boolean }; //missing in typings

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
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

  async prepareModel() {
    if (this.cubaProjectModel) {
      this.model = createModel(this.cubaProjectModel.project);
    } else if (this.answers) {
      const modelFilePath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(this.answers.projectInfo.locationHash, modelFilePath);
      this.cubaProjectModel = readProjectModel(modelFilePath);
      this.model = createModel(this.cubaProjectModel.project);
    }
  }

  // noinspection JSUnusedGlobalSymbols
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
    this.fs.copyTpl(this.templatePath('.package-lock.json'), this.destinationPath('package-lock.json'), this.model);
    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    if (this.cubaProjectModel) {
      generateEntities(this.cubaProjectModel, path.join(this.destinationRoot(), 'src/cuba'), this.fs);
    }

  }

  end() {
    this.log(`CUBA React client has been successfully generated into ${this.destinationRoot()}`);
  }
}


function createModel(project: ProjectInfo): TemplateModel {
  return {
    title: project.name,
    project: project,
    basePath: project.modulePrefix + '-front'
  };
}

export const generator = ReactTSAppGenerator;
export const options = commonGenerationOptionsConfig;
export const params = [];