import {Entity, EntityAttribute, ProjectModel} from "./cuba-model";
import {
  EntityInfo,
  RestQueryInfo,
  RestServiceMethodInfo,
  RestServiceMethodModel,
  ViewInfo
} from "../studio/studio-model";

export function findEntity(projectModel: ProjectModel, entityInfo: EntityInfo): Entity | undefined {
  const entityName = entityInfo.name;
  let entity: Entity | undefined;
  if (Array.isArray(projectModel.entities)) {
    entity = projectModel.entities.find(e => e.name === entityName);
    if (entity != null) {
      return entity;
    }
  } else { // old model structure
    if (projectModel.entities.hasOwnProperty(entityName)) {
      return projectModel.entities[entityName];
    }
  }

  if (projectModel.baseProjectEntities != null) {
    if (Array.isArray(projectModel.baseProjectEntities)) {
      entity = projectModel.baseProjectEntities.find(e => e.name === entityName);
      if (entity != null) {
        return entity;
      }
    } else {
      return projectModel.baseProjectEntities[entityName];
    }
  }
}

export function findView(projectModel: ProjectModel, view: ViewInfo) {
  return projectModel.views.find(v => v.name === view.name && v.entity === view.entityName);
}

export function findQuery(projectModel: ProjectModel, queryInfo: RestQueryInfo) {
  return projectModel.restQueries.find(q => q.entity === queryInfo.entityName && q.name === queryInfo.name);
}

export function findServiceMethod(projectModel: ProjectModel, methodInfo: RestServiceMethodInfo): RestServiceMethodModel | null {
  const service = projectModel.restServices.find(s => s.name === methodInfo.serviceName);
  if (service != null) {
    const method = service.methods.find(m => m.name === methodInfo.methodName);
    if (method != null) {
      return {service, method};
    }
  }
  return null;
}

//todo add assert in integration test with inheritor attrs (sec$User)
export function collectAttributesFromHierarchy(entity: Entity, projectModel: ProjectModel): EntityAttribute[] {
  let attrs: EntityAttribute[] = entity.attributes;

  const allEntities: Partial<Entity>[] = ([] as Partial<Entity>[])
    .concat(projectModel.entities)
    .concat(projectModel.baseProjectEntities ? projectModel.baseProjectEntities : []);

  let {parentClassName, parentPackage} = entity;

  while (parentClassName && parentPackage && parentClassName.length > 0 && parentPackage.length > 0) {
    const parentFqn = `${parentPackage}.${parentClassName}`;
    const parent = allEntities.find(e => e.fqn === parentFqn);
    if (parent) {
      attrs = parent.attributes ? attrs.concat(parent.attributes) : attrs;
      parentPackage = parent.parentPackage ? parent.parentPackage : '';
      parentClassName = parent.parentClassName ? parent.parentClassName : '';
    } else {
      parentPackage = '';
      parentClassName = '';
    }
  }

  return attrs;
}