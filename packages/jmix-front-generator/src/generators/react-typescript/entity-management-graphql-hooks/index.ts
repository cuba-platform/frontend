import {ComponentOptions, componentOptionsConfig} from "../../../common/cli-options";
import * as path from "path";
import {defaultPipeline} from "../../../building-blocks/pipelines/defaultPipeline";
import {allQuestions, Answers, getAnswersFromPrompt} from "./answers";
import { Options } from "./options";
import {TemplateModel, deriveTemplateModel} from "./template-model";
import {write} from "./write";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";

export class React_EntityManagement_GraphQL_Hooks extends YeomanGenerator {

  constructor(args: string | string[], options: ComponentOptions) {
    super(args, options);
  }

  async generate() {
    await defaultPipeline<Options, Answers, TemplateModel>({
      templateDir: path.join(__dirname, 'template'),
      questions: allQuestions, // Used when refining answers
      stages: { // Using custom implementations for some of the stages
        getAnswersFromPrompt,
        deriveTemplateModel,
        write
      }
    }, this);
  }

}

const description = 'CRUD (list + editor) screens for specified entity. Uses GraphQL.';

export {
  React_EntityManagement_GraphQL_Hooks as generator,
  componentOptionsConfig as options, // This is for CLI/Studio to know the available options (--model, --dirShift, etc.)
  allQuestions as params, // This is for CLI/Studio to know the available questions
  description // This description will be displayed by CLI/Studio
}