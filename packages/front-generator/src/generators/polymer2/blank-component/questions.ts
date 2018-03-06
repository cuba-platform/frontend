import {QuestionType} from "../../../common/inquirer";
import {Questions} from "yeoman-generator";

export const questions: Questions = [{
  name: 'componentName',
  message: 'Component Name (must contain dash)',
  type: QuestionType.input
}];