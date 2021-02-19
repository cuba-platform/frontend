import {EntityAttribute} from "../../../../common/model/cuba-model";
import {expect} from "chai";
import {EditRelations} from "../../../../generators/react-typescript/entity-management/template-model";
import {EntityTemplateModel} from "../../../../generators/react-typescript/common/template-model";
import { getRelations, getRelationImports, getViewAttrs } from "../../../../../src/generators/react-typescript/entity-management/shared";

const projectModel = require('../../../fixtures/mpg-projectModel.json');
const projectModelScr = require('../../../fixtures/project-model--scr.json');

describe('entity management generation test', function () {

  it('should collect relations', function () {
    const attributes: EntityAttribute[] = [createAttr('attr1'), createAttr('attr2')];
    const relations = getRelations(projectModel, attributes);

    expect(relations.editAssociations.attr1.path).eq('jmix/entities/mpg$Car');
    expect(relations.editAssociations.attr2.path).eq('jmix/entities/mpg$Car');
  });

  it('should sort out identical items from relation imports', function () {
    const relations: EditRelations = {
      e1: {className: 'Car', path: 'jmix/entities/mpg$Car'} as any,
      e2: {className: 'Car', path: 'jmix/entities/mpg$Car'} as any
    };
    const entity: EntityTemplateModel = {className: 'Car', path: 'jmix/entities/mpg$Car'} as any;
    const relationImports = getRelationImports(relations, entity);
    expect(relationImports.length).eq(1);
    expect(relationImports[0].className).eq('Car');
    expect(relationImports[0].path).eq('jmix/entities/mpg$Car');
  });

  it('should determine view attributes', () => {
    const localView = {name: '_local', entityName: 'scr_DatatypesTestEntity'};
    const viewWithCompositions = {name: 'datatypesTestEntity-view', entityName: 'scr_DatatypesTestEntity'};
    const answers1: any = {
      listView: localView,
      editView: localView
    };
    const answers2: any = {
      listView: viewWithCompositions,
      editView: viewWithCompositions
    };
    const answers3: any = {
      listView: localView,
      editView: viewWithCompositions
    }

    const viewAttrs1 = getViewAttrs(projectModelScr, answers1);
    expect(viewAttrs1.length).to.equal(new Set(viewAttrs1).size);
    expect(viewAttrs1).to.not.contain('compositionO2Oattr');
    expect(viewAttrs1).to.not.contain('compositionO2Mattr');

    const viewAttrs2 = getViewAttrs(projectModelScr, answers2);
    expect(viewAttrs2).to.contain('compositionO2Oattr');
    expect(viewAttrs2).to.contain('compositionO2Mattr');

    const viewAttrs3 = getViewAttrs(projectModelScr, answers3);
    expect(viewAttrs3).to.contain('compositionO2Oattr');
    expect(viewAttrs3).to.contain('compositionO2Mattr');
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
