import {ProjectModel} from "../../../common/model/cuba-model";
import {YeomanGenerator} from "../../YeomanGenerator";
import {CommonGenerationOptions} from "../../../common/cli-options";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import { refineAnswers } from "./pieces/refineAnswers";
import {throwError} from "../../../common/utils";

export const defaultGetAnswersFromOptions = <O extends CommonGenerationOptions, A>(
    projectModel: ProjectModel, gen: YeomanGenerator, options: O, questions: StudioTemplateProperty[]
): A => {
  if (options.answers == null) {
    throwError(gen, 'Answers not found in options');
  }

  gen.log('Skipping prompts since answers are provided');
  const rawAnswers = parseBase64Object(options.answers);
  return refineAnswers(projectModel, questions, rawAnswers);
}

function parseBase64Object<O extends CommonGenerationOptions>(base64EncodedObject: string) {
    return JSON.parse(
      Buffer.from(base64EncodedObject, 'base64')
        .toString('utf8')
    );
}