import {OptionsConfig, commonGenerationOptionsConfig, CommonGenerationOptions} from "../../common/cli-options";
import { defaultGetOptions } from "../stages/options/defaultGetOptions";
import { defaultGetProjectModel } from "../stages/project-model/defaultGetProjectModel";
import { YeomanGenerator } from "../YeomanGenerator";
import { defaultConfigureGenerator } from "../stages/configuring/defaultConfigureGenerator";
import { defaultGetAnswersFromOptions } from "../stages/answers/defaultGetAnswersFromOptions";
import { defaultGetAnswersFromPrompt } from "../stages/answers/defaultGetAnswersFromPrompt";
import { defaultDeriveTemplateModel } from "../stages/template-model/defaultDeriveTemplateModel";
import {StudioTemplateProperty} from "../../common/studio/studio-model";
import {ProjectModel} from "../../common/model/cuba-model";

export interface DefaultPipelineInput<O extends CommonGenerationOptions, A, M> {
  templateDir: string;
  questions: StudioTemplateProperty[],
  optionsConfig?: OptionsConfig;
  stages: DefaultPipelineStages<O, A, M>;
}

export type OptionsStage<O extends CommonGenerationOptions> = (optionsConfig: OptionsConfig, gen: YeomanGenerator) => Promise<O>; //TODO probably doesn't need to be async
export type ConfigStage<O extends CommonGenerationOptions> = (dirname: string, gen: YeomanGenerator, options: O) => Promise<void>; //TODO same
export type ProjectModelStage<O extends CommonGenerationOptions> = (invocationDir: string, gen: YeomanGenerator, options: O) => Promise<ProjectModel>;
export type AnswersFromOptionsStage<O extends CommonGenerationOptions, A> = (projectModel: ProjectModel, gen: YeomanGenerator, options: O, questions: StudioTemplateProperty[]) => Promise<A>;
export type AnswersFromPromptStage<O extends CommonGenerationOptions, A> = (projectModel: ProjectModel, gen: YeomanGenerator, options: O, questions?: StudioTemplateProperty[]) => Promise<A>;
export type TemplateModelStage<O extends CommonGenerationOptions, A, M> = (answers: A, projectModel: ProjectModel, gen: YeomanGenerator, options: O) => M;
export type WriteStage<O extends CommonGenerationOptions, M> = (projectModel: ProjectModel, templateModel: M, gen: YeomanGenerator, options: O) => Promise<void>;

export interface DefaultPipelineStages<O extends CommonGenerationOptions, A, M> {
  getOptions?: OptionsStage<O>;
  configureGenerator?: ConfigStage<O>;
  getProjectModel?: ProjectModelStage<O>;
  getAnswersFromOptions?: AnswersFromOptionsStage<O, A>;
  getAnswersFromPrompt: AnswersFromPromptStage<O, A>;
  deriveTemplateModel: TemplateModelStage<O, A, M>;
  write: WriteStage<O, M>
}

/**
 * Represents the default sequence of stages that should be suitable for most generators.
 *
 * @param input
 * @param gen
 */
export async function defaultPipeline<O extends CommonGenerationOptions, A, M>(
  input: DefaultPipelineInput<O, A, M>,
  gen: YeomanGenerator
) {

  const {
    templateDir,
    questions = [],
    optionsConfig = commonGenerationOptionsConfig,
  } = input;

  // Each of these functions is an implementation of a stage in the default pipeline
  const {
    getOptions = defaultGetOptions,
    configureGenerator = defaultConfigureGenerator,
    getProjectModel = defaultGetProjectModel,
    getAnswersFromOptions = defaultGetAnswersFromOptions,
    getAnswersFromPrompt = defaultGetAnswersFromPrompt,
    deriveTemplateModel = defaultDeriveTemplateModel,
    write
  } = input.stages;

  // Setting the generator's destinationRoot (which happens inside configureGenerator) will change the current working directory,
  // therefore we need to save the directory from which the generator command was invoked.
  const invocationDir = process.cwd();

  // Obtain the options passed from command line
  const options = await getOptions(optionsConfig, gen);
  // Apply default configuration to the Yeoman generator
  await configureGenerator(templateDir, gen, options);
  // Obtain project model
  const projectModel = await getProjectModel(invocationDir, gen, options);

  // Obtain answers and refine them (i.e. add context / additional data from project model)
  const answers = await obtainAnswers<O, A>(
    questions, projectModel, getAnswersFromPrompt, getAnswersFromOptions, gen, options
  );

  // Derive template model from answers, project model and options
  const templateModel = await deriveTemplateModel(answers, projectModel, gen, options);

  // Write files to disk, performing interpolations using the template model
  gen.log(`Generating to ${gen.destinationPath()}`);
  await write(projectModel, templateModel, gen, options);
}

async function obtainAnswers<O extends CommonGenerationOptions, A>(
  questions: StudioTemplateProperty[],
  projectModel: ProjectModel,
  getAnswersFromPrompt: (projectModel: ProjectModel, gen: YeomanGenerator, options: O, questions?: StudioTemplateProperty[]) => Promise<A>,
  getAnswersFromOptions: (projectModel: ProjectModel, gen: YeomanGenerator, options: O, questions: StudioTemplateProperty[]) => Promise<A>,
  gen: YeomanGenerator,
  options: O
): Promise<A> {
  // Not every generator has questions / needs answers
  if (questions == null || questions.length === 0) {
    return {} as A;
  }

  return options.answers == null
    ? await getAnswersFromPrompt(projectModel, gen, options, questions)
    : await getAnswersFromOptions(projectModel, gen, options, questions);
}