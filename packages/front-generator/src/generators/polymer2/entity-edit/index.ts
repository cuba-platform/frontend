import {PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {BaseGenerator} from "../../../common/generation";
import {StudioTemplateProperty} from "../../../common/cuba-studio";
import {EntityEditAnswers, entityEditParams} from "./params";
import {EntityEditTemplateModel} from "./template-model";
import * as path from "path";
import {elementNameToClass} from "../../../common/utils";
import {Entity, EntityAttribute, View} from "../../../common/cuba-model";
import {fieldDependencies, FieldModel, getFieldHtml, getFieldModel} from "../common/fields";


class EntityEditGenerator extends BaseGenerator<EntityEditAnswers, EntityEditTemplateModel, PolymerElementOptions> {

  constructor(args: string | string[], options: PolymerElementOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    await this._promptOrParse();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    this.model = entityEditAnswersToModel(this.answers, this.options.dirShift);
    this.fs.copyTpl(
      this.templatePath('entity-edit.html'),
      this.destinationPath(this.model.componentName + '.html'), this.model
    );
  }

  end() {
    this.log(`Entity edit has been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityEditParams
  }

  _getAvailableOptions() {
    return polymerElementOptionsConfig;
  }
}

export const composeEditFields = (entity: Entity, view: View): { fields: string[], imports: string[] } => {
  if (entity == null || view == null) {
    return {fields: [], imports: []};
  }
  const attributes: EntityAttribute[] = view.allProperties.reduce((attrArr: EntityAttribute[], prop) => {
    const attr = entity.attributes.find(ea => ea.name === prop.name);
    if (attr) {
      attrArr.push(attr);
    }
    return attrArr;
  }, []);
  const models: FieldModel[] = attributes.map(attr => getFieldModel(attr));

  const fields: string[] = models.map(m => getFieldHtml(m));
  const imports: string[] = models.reduce((importsCollector:string[], model) => {
    const deps = fieldDependencies[model.type];
    if (deps) {
      deps.forEach(dep => {
        if (importsCollector.indexOf(dep) < 0) {
          importsCollector.push(dep);
        }
      })
    }
    return importsCollector;
  }, []);

  return {fields, imports}
};

export function entityEditAnswersToModel(answers: EntityEditAnswers, dirShift: string | undefined): EntityEditTemplateModel {
  const {fields, imports} = composeEditFields(answers.entity, answers.editView);
  return {
    fields,
    imports,
    componentName: answers.editComponentName,
    className: elementNameToClass(answers.editComponentName),
    relDirShift: dirShift || '',
    view: answers.editView,
    entity: answers.entity,
  }
}

export {
  EntityEditGenerator as generator,
  entityEditParams as params,
  polymerElementOptionsConfig as options,
}