import {Entity, Enum} from "../common/model/cuba-model";
import {ProjectEntityInfo} from "../common/model/entities-generation";
import {collectModelContext, ModelContext} from "../common/utils";

const enumsModel: Enum[] = require('./enums-model.json');
const entityModel: Entity = require('./entity-model.json');

export function modelCtx(): ModelContext {
  return collectModelContext({entities: [entityModel], enums: enumsModel} as any);
}

export function createTestProjectEntityInfo(className: string, isBase: boolean = false): ProjectEntityInfo {
  const shortName = className.split('.').pop();
  return {
    type: {className: className},
    entity: {className: shortName, name: (isBase ? 'sys$' : 'mpg$') + shortName}
  } as any;
}