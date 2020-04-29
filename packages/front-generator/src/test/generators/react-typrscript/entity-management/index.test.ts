import {EntityAttribute} from "../../../../common/model/cuba-model";
import {getRelationImports, getRelations} from "../../../../generators/react-typescript/entity-management";
import {expect} from "chai";
import {EditRelations} from "../../../../generators/react-typescript/entity-management/template-model";
import {EntityTemplateModel} from "../../../../generators/react-typescript/common/template-model";

const projectModel = require('../../../fixtures/mpg-projectModel.json');

describe('entity management generation test', function () {

  it('should collect relations', function () {
    const attributes: EntityAttribute[] = [createAttr('attr1'), createAttr('attr2')];
    const relations = getRelations(projectModel, attributes);

    expect(relations.editAssociations.attr1.path).eq('cuba/entities/mpg$Car');
    expect(relations.editAssociations.attr2.path).eq('cuba/entities/mpg$Car');
  });

  it('should sort out identical items from relation imports', function () {
    const relations: EditRelations = {
      e1: {className: 'Car', path: 'cuba/entities/mpg$Car'} as any,
      e2: {className: 'Car', path: 'cuba/entities/mpg$Car'} as any
    };
    const entity: EntityTemplateModel = {className: 'Car', path: 'cuba/entities/mpg$Car'} as any;
    const relationImports = getRelationImports(relations, entity);
    expect(relationImports.length).eq(1);
    expect(relationImports[0].className).eq('Car');
    expect(relationImports[0].path).eq('cuba/entities/mpg$Car');
  });
});

function createAttr(name: string): EntityAttribute {
  return {
    mappingType: 'ASSOCIATION',
    name,
    type: {
      packageName: "com.company.mpg.entity",
      className: "Car",
      fqn: "com.company.mpg.entity.Car",
      label: "Car",
      entityName: "mpg$Car"
    }
  } as EntityAttribute;
}
