import {fromStudioProperty, ObjectChoice} from "../../common/questions";
import * as projectModel from '../fixtures/mpg-projectModel.json';
import {StudioTemplatePropertyType} from '../../common/studio/studio-model';
import { expect } from "chai";

describe('interactive CLI question helpers', () => {
  it('correctly creates choices for an Entity', () => {
    const prop = {
      code: 'test',
      caption: 'test',
      propertyType: StudioTemplatePropertyType.ENTITY,
    };

    // @ts-ignore TODO VP Replace enums with string union types in ProjectModel https://github.com/cuba-platform/front-generator/issues/46
    const question = fromStudioProperty(prop, projectModel);

    expect(question.choices).to.exist;
    expect(question.choices).to.be.an('Array');

    const expectedEntityNames = ["MpgUserInfo", "mpg$SparePart", "mpg$Car", "mpg$FavoriteCar", "mpg$TechnicalCertificate",
      "mpg$Garage", "mpg$CarRent"];
    const actualEntityNames = (question.choices! as ObjectChoice[]).map((choice: ObjectChoice) => choice.name);
    expect(actualEntityNames).to.deep.equal(expectedEntityNames);
  });

  it('correctly creates choices for a View', () => {
    const prop = {
      code: 'test',
      caption: 'test',
      propertyType: StudioTemplatePropertyType.VIEW,
    };

    const previousAnswers = {
      entity: {
        name: 'mpg$FavoriteCar'
      }
    };

    // @ts-ignore TODO VP Replace enums with string union types in ProjectModel https://github.com/cuba-platform/front-generator/issues/46
    const question = fromStudioProperty(prop, projectModel);

    expect(question.choices).to.exist;
    expect(question.choices).to.be.a('Function');

    const expectedViewNames = ["_minimal", "_local", "_base", "favoriteCar-view", "favoriteCar-edit"];
    const actualViewNames = (question.choices as Function)(previousAnswers).map((choice: ObjectChoice) => choice.name);
    expect(actualViewNames).to.deep.equal(expectedViewNames);
  });
});
