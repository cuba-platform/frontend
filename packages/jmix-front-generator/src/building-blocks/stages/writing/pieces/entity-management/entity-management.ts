import {YeomanGenerator} from "../../../../YeomanGenerator";
import {capitalizeFirst} from "../../../../../common/utils";

export function writeManagementComponent<M extends {className: string}>(
  gen: YeomanGenerator,
  extension: string,
  model: M
) {
  gen.fs.copyTpl(
    gen.templatePath('EntityManagement' + extension),
    gen.destinationPath(model.className + extension), model
  );
}

export function writeListComponent<L extends string, M extends {listType: L, listComponentClass: string}>(
  gen: YeomanGenerator,
  extension: string,
  model: M
) {
  const listTemplateFile = capitalizeFirst(model.listType) + extension;
  gen.fs.copyTpl(
    gen.templatePath(listTemplateFile),
    gen.destinationPath(model.listComponentClass + extension), model
  );
}

export function writeEditorComponent<M extends {editComponentClass: string}>(
  gen: YeomanGenerator,
  extension: string,
  model: M
) {
  gen.fs.copyTpl(
    gen.templatePath('EntityManagementEditor' + extension),
    gen.destinationPath(model.editComponentClass + extension), model
  );
}
