import {CommonTemplateModel} from "../common";
import {elementNameToClass, normalizeRelativePath, unCapitalizeFirst} from "../../../../../common/utils";
import {DirShiftOption} from "../../../options/pieces/dir-shift";

export type EntityManagementCommonTemplateModel<L extends string> = CommonTemplateModel & {
  listComponentClass: string;
  editComponentClass: string;
  listType: L;
  nameLiteral: string;
};

export type EntityManagementCommonAnswers<L extends string> = {
  managementComponentName: string;
  listComponentName: string;
  editComponentName: string;
  listType: L;
};

/**
 * To be used in all entity management templates
 *
 * @param options
 * @param answers
 */
export function deriveEntityManagementCommon<O extends DirShiftOption, L extends string>(
  options: O, answers: EntityManagementCommonAnswers<L>
): EntityManagementCommonTemplateModel<L> {

  const className = elementNameToClass(answers.managementComponentName);
  const componentName = answers.managementComponentName;
  const relDirShift = normalizeRelativePath(options.dirShift);

  const listComponentClass = elementNameToClass(answers.listComponentName);
  const editComponentClass = elementNameToClass(answers.editComponentName);
  const listType = answers.listType;
  const nameLiteral = unCapitalizeFirst(className);

  return {
    className,
    componentName,
    relDirShift,
    listComponentClass,
    editComponentClass,
    listType,
    nameLiteral
  };
}