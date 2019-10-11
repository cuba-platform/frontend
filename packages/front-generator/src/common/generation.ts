import * as Base from "yeoman-generator";
import * as path from "path";
import {CommonGenerationOptions, commonGenerationOptionsConfig, OptionsConfig} from "./cli-options";
import {
  EntityInfo,
  RestQueryInfo,
  RestServiceMethodInfo,
  StudioTemplateProperty,
  StudioTemplatePropertyType,
  ViewInfo
} from "./studio/studio-model";
import {fromStudioProperties} from "./questions";
import * as fs from "fs";
import {ProjectModel} from "./model/cuba-model";
import {findEntity, findQuery, findServiceMethod, findView} from "./model/cuba-model-utils";
import {exportProjectModel, getOpenedCubaProjects, StudioProjectInfo} from './studio/studio-integration';

interface ProjectInfoAnswers {
  projectInfo: StudioProjectInfo;
}

export abstract class BaseGenerator<A, M, O extends CommonGenerationOptions> extends Base {

  options: O = ({} as O);
  answers?: A;
  model?: M;

  conflicter!: { force: boolean }; //patch missing in typings

  protected cubaProjectModel?: ProjectModel;

  constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);
    this._populateOptions(this._getAvailableOptions());
    this.destinationRoot(this._getDestRoot());
  }

  protected async _obtainCubaProjectModel() {
    if (this.options.model) {
      this.log('Skipping project model prompts since model is provided');
      this.conflicter.force = true;
      this.cubaProjectModel = readProjectModel(this.options.model);
    } else {
      const openedCubaProjects = await getOpenedCubaProjects();
      if (openedCubaProjects.length < 1) {
        this.env.error(Error("Please open Cuba Studio Intellij and enable Old Studio integration"));
      }

      const projectModelAnswers: ProjectInfoAnswers = await this.prompt([{
        name: 'projectInfo',
        type: 'list',
        message: 'Please select CUBA project you want use for generation',
        choices: openedCubaProjects.map(p => ({
          name: `${p.name} [${p.path}]`,
          value: p
        }))
      }]) as ProjectInfoAnswers;

      const modelFilePath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(projectModelAnswers.projectInfo.locationHash, modelFilePath);
      this.cubaProjectModel = readProjectModel(modelFilePath);
    }
  }

  protected async _obtainAnswers() {
    await this._obtainCubaProjectModel();

    let unrefinedAnswers: A;
    if (this.options.answers) {
      this.log('Skipping prompts since answers are provided');
      this.conflicter.force = true;
      const answersBuffer = Buffer.from(this.options.answers, 'base64').toString('utf8');
      unrefinedAnswers = JSON.parse(answersBuffer);
    } else {
      unrefinedAnswers = await this.prompt(fromStudioProperties(this._getParams(), this.cubaProjectModel)) as A;
    }
    this.answers = refineAnswers<A>(this.cubaProjectModel!, this._getParams(), unrefinedAnswers);
  }

  protected async _promptOrParse() {
    if (this.options.model) {
      this.cubaProjectModel = readProjectModel(this.options.model);
    }

    if (this.options.model && this.options.answers) { // passed from studio
      this.conflicter.force = true;
      const encodedAnswers = Buffer.from(this.options.answers, 'base64').toString('utf8');
      const parsedAnswers = JSON.parse(encodedAnswers);

      this.answers = refineAnswers<A>(this.cubaProjectModel!, this._getParams(), parsedAnswers);
      return Promise.resolve();
    }

    this.answers = await this.prompt(fromStudioProperties(this._getParams())) as A;
  }

  protected _populateOptions(availableOption: OptionsConfig) {
    Object.keys(availableOption).forEach(optionName => {
      this.option(optionName, availableOption[optionName]);
    });
  }

  protected _getDestRoot(): string {
    if (!this.options.dest) {
      return this.destinationRoot();
    }
    if (path.isAbsolute(this.options.dest)) {
      return this.options.dest
    }
    return path.join(this.destinationRoot(), this.options.dest)
  }

  _getAvailableOptions(): OptionsConfig {
    return commonGenerationOptionsConfig;
  }

  _getParams(): StudioTemplateProperty[] {
    return [];
  }

  abstract writing(): void
}

export interface GeneratorExports {
  generator: typeof BaseGenerator,
  options?: OptionsConfig,
  params?: StudioTemplateProperty[],
  description?: string;
}

export function readProjectModel(modelFilePath: string): ProjectModel {
  if (!fs.existsSync(modelFilePath)) {
    throw new Error('Specified model file does not exist');
  }
  return JSON.parse(fs.readFileSync(modelFilePath, "utf8"));
}

function refineAnswers<T>(projectModel: ProjectModel, props: StudioTemplateProperty[], answers: any): T {
  const refinedAnswers: { [key: string]: any } = {};
  Object.keys(answers).forEach((key: string) => {
    const prop = props.find(p => p.code === key);
    if (prop == null) {
      refinedAnswers[key] = answers[key];
      return;
    }
    switch (prop.propertyType) {
      case StudioTemplatePropertyType.ENTITY:
        refinedAnswers[key] = findEntity(projectModel, (answers[key] as EntityInfo));
        return;
      case StudioTemplatePropertyType.VIEW:
        refinedAnswers[key] = findView(projectModel, (answers[key] as ViewInfo));
        return;
      case StudioTemplatePropertyType.REST_QUERY:
        refinedAnswers[key] = findQuery(projectModel, (answers[key] as RestQueryInfo));
        return;
      case StudioTemplatePropertyType.REST_SERVICE_METHOD:
        refinedAnswers[key] = findServiceMethod(projectModel, (answers[key] as RestServiceMethodInfo));
        return;
      default:
        refinedAnswers[key] = answers[key];
    }
  });
  return refinedAnswers as T;
}
