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
import {
  exportProjectModel,
  getOpenedCubaProjects,
  ERR_STUDIO_NOT_CONNECTED,
  StudioProjectInfo
} from './studio/studio-integration';
import * as AutocompletePrompt from 'inquirer-autocomplete-prompt';
import through2 = require('through2');
import prettier = require('prettier');

/**
 * @deprecated
 */
interface ProjectInfoAnswers {
  projectInfo: StudioProjectInfo;
}

/**
 * @alpha
 * @deprecated
 */
export abstract class BaseGenerator<A, M, O extends CommonGenerationOptions> extends Base {

  options: O = ({} as O);
  answers?: A;
  model?: M;

  conflicter!: { force: boolean }; //patch missing in typings

  protected cubaProjectModel?: ProjectModel;
  protected modelFilePath?: string;

  protected constructor(args: string | string[], options: CommonGenerationOptions) {
    super(args, options);

    // store initial dir where generator invoked from, process.cwd() is changed after
    // this.destinationRoot() called
    const executionDir = process.cwd();

    this._populateOptions(this._getAvailableOptions());
    this.destinationRoot(this._getDestRoot());
    this.modelFilePath = this._composeModelFilePath(this.options, executionDir);

    // @ts-ignore this.env.adapter is missing in the typings
    this.env.adapter
      .promptModule.registerPrompt('autocomplete',  AutocompletePrompt);
    this.registerTransformStream(createEjsRenameTransform());
    this.registerTransformStream(createFormatTransform());
  }

  protected _composeModelFilePath(options: O, executionDir: string) : string | undefined {
    const {model} = options;
    if (model == null) return undefined;

    return path.isAbsolute(model) ? model: path.join(executionDir, model);
  }

  protected async _obtainCubaProjectModel() {
    if (this.modelFilePath) {
      this.log('Skipping project model prompts since model is provided');
      this.conflicter.force = true;
      this.cubaProjectModel = this._readProjectModel();
    } else {
      const openedCubaProjects = await getOpenedCubaProjects();
      if (!openedCubaProjects || openedCubaProjects.length < 1) {
        this.env.error(Error(ERR_STUDIO_NOT_CONNECTED));
        return;
      }

      const projectModelAnswers: ProjectInfoAnswers = await this.prompt([{
        name: 'projectInfo',
        type: 'list',
        message: 'Please select CUBA project you want to use for generation',
        choices: openedCubaProjects && openedCubaProjects.map(p => ({
          name: `${p.name} [${p.path}]`,
          value: p
        }))
      }]) as ProjectInfoAnswers;

      this.modelFilePath = path.join(process.cwd(), 'projectModel.json');
      await exportProjectModel(projectModelAnswers.projectInfo.locationHash, this.modelFilePath);

      this.cubaProjectModel = this._readProjectModel();
    }
  }

  // TODO Remove method, use readProjectModel() function directly
  protected _readProjectModel(): ProjectModel {
    const {modelFilePath} = this;
    return readProjectModel(modelFilePath);
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
      unrefinedAnswers = await this._additionalPrompts(unrefinedAnswers);
      this.options.verbose && this.log('Component config:\n' + JSON.stringify(unrefinedAnswers));
    }
    this.answers = refineAnswers<A>(this.cubaProjectModel!, this._getParams(), unrefinedAnswers);
  }

  protected async _promptOrParse() {
    if (this.modelFilePath) {
      this.cubaProjectModel = this._readProjectModel();
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

  /**
   * Additional dynamic prompts where questions depend on answers to initial prompt
   *
   * @param answers
   * @private
   */
  protected async _additionalPrompts(answers: A): Promise<A> {
    return answers;
  }

  abstract writing(): void
}

/**
 * @deprecated
 */
export interface GeneratorExports {
  generator: typeof BaseGenerator,
  options?: OptionsConfig,
  params?: StudioTemplateProperty[],
  description?: string;
}

/**
 * @deprecated
 * @param modelFilePath
 */
export function readProjectModel(modelFilePath?: string): ProjectModel {
  if (!modelFilePath || !fs.existsSync(modelFilePath)) {
    throw new Error('Specified model file does not exist ' + modelFilePath);
  }
  return JSON.parse(fs.readFileSync(modelFilePath, "utf8"));
}

// TODO fix answers type
/**
 * @deprecated
 * @param projectModel
 * @param generatorParams
 * @param answers
 */
export function refineAnswers<T>(projectModel: ProjectModel, generatorParams: StudioTemplateProperty[], answers: any): T {
  const refinedAnswers: { [key: string]: any } = {};

  if (answers == null) return refinedAnswers as T;

  Object.keys(answers).forEach((key: string) => {
    const prop = generatorParams.find(p => p.code === key);

    // leave answer as is if it is not exist in props
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
      case StudioTemplatePropertyType.INTEGER:
        const value = answers[key];
        if (!Number.isInteger(value)) throw new Error(`Question with code '${key}' has INTEGER type and can't contain '${value}' as answer`);
        refinedAnswers[key] = value;
        return;
      default:
        refinedAnswers[key] = answers[key];
    }
  });
  return refinedAnswers as T;
}

/**
 * Transform stream for remove .ejs extension from files. We are using this extension to improve code
 * highlight in editor
 * @deprecated
 */
function createEjsRenameTransform() {
    return through2.obj(function (file, enc, callback) {

      file.basename = file.basename
        .replace(/.ts.ejs$/, '.ts')
        .replace(/.tsx.ejs$/, '.tsx');

      this.push(file);
      callback();
    });
}

/**
 * Prettier formatting transform stream for .ts and .tsx files
 * @deprecated
 */
function createFormatTransform() {
  return through2.obj(function (file, enc, callback) {

    if (file.path.endsWith('.ts') || file.path.endsWith('.tsx')) {
      const contents = Buffer.from(file.contents).toString('utf8');
      file.contents = Buffer.from(prettier.format(contents, {parser: "typescript"}));
    }

    this.push(file);
    callback();
  });
}

