import {BaseGenerator} from "../../../common/base-generator";
import {EntityCardsAnswers, entityCardsParams} from "./params";
import {OptionsConfig, PolymerElementOptions, polymerElementOptionsConfig} from "../../../common/cli-options";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import * as path from "path";
import {EntityCardsTemplateModel} from "./template-model";
import {elementNameToClass, unCapitalizeFirst} from "../../../common/utils";
import {addToMenu} from "../common/menu";
import {writeComponentI18nMessages} from '../common/i18n';
import {createEntityTemplateModel, getDisplayedAttributes} from "../common/entity";
import {EntityTemplateModel} from "../common/template-model";
import {ProjectModel} from "../../../common/model/cuba-model";


class EntityCardsGenerator extends BaseGenerator<EntityCardsAnswers, EntityCardsTemplateModel, PolymerElementOptions> {

  constructor(args: string | string[], options: PolymerElementOptions) {
    super(args, options);
    this.sourceRoot(path.join(__dirname, 'template'));
  }

  // noinspection JSUnusedGlobalSymbols
  async prompting() {
    this.conflicter.force = true;
    await this._obtainAnswers();
  }

  // noinspection JSUnusedGlobalSymbols
  writing() {
    this.log(`Generating to ${this.destinationPath()}`);
    if (!this.answers) {
      throw new Error('Answers not provided');
    }
    if (!this.cubaProjectModel) {
      throw new Error('CUBA project model is not provided');
    }
    const entity: EntityTemplateModel = createEntityTemplateModel(this.answers.entity, this.cubaProjectModel);
    this.model = entityCardsAnswersToModel(this.answers, this.options.dirShift, entity, this.cubaProjectModel);
    this.fs.copyTpl(
      this.templatePath('EntityCards.tsx.ejs'),
      this.destinationPath(this.model.className + '.tsx.ejs'), this.model
    );

    writeComponentI18nMessages(this.fs, this.model.className, this.options.dirShift);

    if (!addToMenu(this.fs, {
      componentFileName: this.model.className,
      componentClassName: this.model.className,
      caption: this.model.className,
      dirShift: this.options.dirShift,
      destRoot: this.destinationRoot(),
      menuLink: '/' + this.model.nameLiteral,
      pathPattern: '/' + this.model.nameLiteral
    })) {
      this.log('Unable to add component to menu: route registry not found');
    }
  }

  end() {
    this.log(`Entity cards have been successfully generated into ${this.destinationRoot()}`);
  }

  _getParams(): StudioTemplateProperty[] {
    return entityCardsParams;
  }

  _getAvailableOptions(): OptionsConfig {
    return polymerElementOptionsConfig;
  }
}

export function entityCardsAnswersToModel(
  answers: EntityCardsAnswers, dirShift: string | undefined, entity: EntityTemplateModel, projectModel: ProjectModel
): EntityCardsTemplateModel {
  const className = elementNameToClass(answers.componentName);
  const attributes = getDisplayedAttributes(answers.entityView.allProperties, entity, projectModel);
  return {
    componentName: answers.componentName,
    className: className,
    nameLiteral: unCapitalizeFirst(className),
    relDirShift: dirShift || '',
    entity: answers.entity,
    view: answers.entityView,
    attributes
  }
}

const description = 'Read-only list of entities displayed as cards';

export {
  EntityCardsGenerator as generator,
  polymerElementOptionsConfig as options,
  entityCardsParams as params,
  description
}
