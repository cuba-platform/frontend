import {
  collectAttributesFromHierarchy,
  findEntity,
  findQuery,
  findServiceMethod,
  findView
} from "../../../common/model/cuba-model-utils";
import {RestServiceMethodInfo} from "../../../common/studio/studio-model";
import {expect} from "chai";
import {Entity, EntityAttribute} from "../../../common/model/cuba-model";

const projectModel = require('../../fixtures/mpg-projectModel.json');

describe('cuba model utils', function () {

  it('should find view', function () {
    expect(findView(projectModel, {entityName: '', name: ''})).to.be.undefined;
    expect(findView(projectModel, {entityName: 'MpgUserInfo', name: '_minimal'})!.classFqn)
      .eq('com.company.mpg.entity.MpgUserInfo');
  });

  it('should find query', function () {
    expect(findQuery(projectModel, {entityName: '', name: ''})).to.be.undefined;
    expect(findQuery(projectModel, {entityName: 'mpg$Car', name: 'allCars'})!.jpql).eq('select c from mpg$Car c');
  });

  it('should find service method', function () {
    expect(findServiceMethod(projectModel, {methodName: '', serviceName: ''})).to.be.null;

    const methodInfo: RestServiceMethodInfo = {methodName: 'addFavorite', serviceName: 'mpg_FavoriteService'};
    const methodModel = findServiceMethod(projectModel, methodInfo);

    expect(methodModel!.service.name).eq('mpg_FavoriteService');
    expect(methodModel!.method.name).eq('addFavorite');
  });

  it('should find entity', function () {
    expect(findEntity(projectModel, {name: ''})).to.be.undefined;
    expect(findEntity(projectModel, {name: 'mpg$Car'})!.fqn).eq('com.company.mpg.entity.Car');
    expect(findEntity(projectModel, {name: 'sec$User'})!.fqn).eq('com.haulmont.cuba.security.entity.User');
  });

  it('should collect attributes from hierarchy', function () {
    const secUser: Entity = findEntity(projectModel, {name: 'sec$User'})!;
    const attrs: EntityAttribute[] = collectAttributesFromHierarchy(secUser, projectModel);
    expect(attrs.find(a => a.name == 'version')).is.not.empty;
  });

});