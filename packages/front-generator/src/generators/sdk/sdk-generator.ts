import {BaseGenerator, readProjectModel} from "../../common/base-generator";
import {CommonGenerationOptions} from "../../common/cli-options";
import * as path from "path";
import {
  ERR_STUDIO_NOT_CONNECTED,
  exportProjectModel,
  getOpenedCubaProjects,
  StudioProjectInfo
} from "../../common/studio/studio-integration";
import {generateEntities} from "./model/entities-generation";
import {generateServices} from "./services/services-generation";
import {generateQueries} from "./services/queries-generation";
import {collectModelContext} from "./model/model-utils";

interface Answers {
  projectInfo: StudioProjectInfo;
}

enum RunMode {
  ALL = 'ALL', MODEL = 'MODEL'
}

/**
 * Yeoman generator for SDK.
 * Note, yeoman run all methods, declared in class - https://yeoman.io/authoring/#adding-your-own-functionality
 */
class SdkGenerator extends BaseGenerator<Answers, {}, CommonGenerationOptions> {

  conflicter!: { force: boolean }; //missing in typings
  runMode: RunMode;

  constructor(args: string | string[], options: CommonGenerationOptions, runMode: RunMode) {
    super(args, options);
    this.runMode = runMode;
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  async prompting() {
    if (this.options.model) {
      this.conflicter.force = true;
      this.log('Skipping prompts since model provided');
      this.cubaProjectModel = readProjectModel(this.options.model);
      return;
    }

    const openedCubaProjects = await getOpenedCubaProjects();
    if (!openedCubaProjects || openedCubaProjects.length < 1)  {
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

  // noinspection JSUnusedGlobalSymbols
  async prepareModel() {
    if (!this.cubaProjectModel && this.answers) {
      const modelFilePath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(this.answers.projectInfo.locationHash, modelFilePath);

      // TODO exportProjectModel is resolved before the file is created. Timeout is a temporary workaround.
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.cubaProjectModel = readProjectModel(modelFilePath);
    }
  }

  writing() {
    if (this.cubaProjectModel) {

      const {restQueries, restServices} = this.cubaProjectModel;
      const runMode = this.runMode.toString().toLowerCase();
      this.log(`Generating sdk:${runMode} to ${this.destinationPath()}`);

      generateEntities(this.cubaProjectModel, path.join(this.destinationRoot()), this.fs);

      const ctx = collectModelContext(this.cubaProjectModel);

      if (this.runMode == RunMode.ALL) {
        const services = generateServices(restServices, ctx);
        this.fs.write(this.destinationPath('services.ts'), services);

        const queries = generateQueries(restQueries, ctx);
        this.fs.write(this.destinationPath('queries.ts'), queries);
      }

    } else {
      this.env.error(Error('Skip sdk generation - no project model provided'));
    }
  }

  end() {
    this.log(`SDK been successfully generated into ${this.destinationRoot()}`);
  }

}

class SdkGeneratorRunner extends SdkGenerator {

  /**
   yeoman run all class methods - https://yeoman.io/authoring/#adding-your-own-functionality,
   but not from parent, so we need method to start generation
   process from inheritor classes
   NOTE that all new added methods in SdkGenerator should be added and run here
   */
  async generate() {
    await this.prompting();
    await this.prepareModel();
    this.writing();
    this.end();
  }
}

export class SdkAllGenerator extends SdkGeneratorRunner {
  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options, RunMode.ALL);
  }

  async generate() {
    await super.generate();
  }
}

export class SdkModelGenerator extends SdkGeneratorRunner {
  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options, RunMode.MODEL);
  }

  async generate() {
    await super.generate();
  }
}
