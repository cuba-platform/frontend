import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {ProjectModel} from "../../../common/model/cuba-model";
import {YeomanGenerator} from "../../YeomanGenerator";
import {CommonGenerationOptions} from "../../../common/cli-options";
import {fromStudioProperties} from "../../../common/questions";
import {refineAnswers} from "./pieces/refineAnswers";
import {throwError} from "../../../common/utils";

/**
 * Simply asks the given questions. Usable in most cases (when you don't need complex logic
 * e.g. determine whether to ask a question based on an answer to another question).
 *
 * @param projectModel
 * @param gen
 * @param options
 * @param questions
 */
export const defaultGetAnswersFromPrompt = async <O extends CommonGenerationOptions, A>(
    projectModel: ProjectModel,
    gen: YeomanGenerator,
    options: O,
    questions?: StudioTemplateProperty[]
): Promise<A> => {
  if (questions == null) {
    throwError(gen, 'Questions not provided');
  }
  const answers = await askQuestions(questions, projectModel, gen) as A;
  options.verbose && gen.log('Component config:\n' + JSON.stringify(answers));
  return answers;
};

/**
 * Asks the given questions and returns *refined* answers.
 *
 * @param questions
 * @param projectModel
 * @param gen
 */
export const askQuestions = async <A>(questions: StudioTemplateProperty[], projectModel: ProjectModel, gen: YeomanGenerator): Promise<A> => {
  const rawAnswers = await gen.prompt(fromStudioProperties(questions, projectModel)) as A;
  return refineAnswers(projectModel, questions, rawAnswers);
};
