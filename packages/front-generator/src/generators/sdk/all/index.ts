import {BaseGenerator, readProjectModel} from "../../../common/generation";
import {CommonGenerationOptions, commonGenerationOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {generateEntities} from "../../../common/model/entities-generation";
import {exportProjectModel, getOpenedCubaProjects, StudioProjectInfo} from "../../../common/studio/studio-integration";

interface Answers {
  projectInfo: StudioProjectInfo;
}

class SdkGenerator extends BaseGenerator<Answers, {}, CommonGenerationOptions> {

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
    if (!this.cubaProjectModel && this.answers) {
      const modelFilePath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(this.answers.projectInfo.locationHash, modelFilePath);
      this.cubaProjectModel = readProjectModel(modelFilePath);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    this.fs.copyTpl(this.templatePath() + '/*.*', this.destinationPath(), this.cubaProjectModel!);
    if (this.cubaProjectModel) {
      generateEntities(this.cubaProjectModel, path.join(this.destinationRoot()), this.fs);
    }

  }

  end() {
    this.log(`SDK been successfully generated into ${this.destinationRoot()}`);
  }
}


export const generator = SdkGenerator;
export const options = commonGenerationOptionsConfig;
export const params = [];