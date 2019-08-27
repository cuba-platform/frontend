import {collectModelContext, ModelContext} from "../common/model/model-utils";
import {Entity, Enum} from "../common/model/cuba-model";

const enumsModel: Enum[] = require('./enums-model.json');
const entityModel: Entity = require('./entity-model.json');

export function modelCtx(): ModelContext {
  return collectModelContext({entities: [entityModel], enums: enumsModel} as any);
}