import {Entity, EntityAttribute, ProjectModel} from "./cuba-model";
import {
  EntityInfo,
  RestQueryInfo,
  RestServiceMethodInfo,
  RestServiceMethodModel,
  ViewInfo
} from "../studio/studio-model";

export function findEntity(projectModel: ProjectModel, entityInfo: EntityInfo | string): Entity | undefined {
  const entityName = typeof entityInfo === 'string'
    ? entityInfo
    : entityInfo.name;
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

export function findViewsForEntity(projectModel: ProjectModel, entityName: string): ViewInfo[] {
  return projectModel.views
    .filter(view => view.entity === entityName)
    .map(view => ({ // Convert View (studio project model) to ViewInfo (metadata)
        name: view.name,
        entityName: view.entity
      })
    );
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

export function collectAttributesFromHierarchy(entity: Entity, projectModel: ProjectModel): EntityAttribute[] {
  let attrs: EntityAttribute[] = entity.attributes;

  const allEntities: Partial<Entity>[] = ([] as Partial<Entity>[])
    .concat(projectModel.entities)
    .concat(projectModel.baseProjectEntities ? projectModel.baseProjectEntities : []);

  let {parentClassName, parentPackage} = entity;

  let parentFqn = composeParentFqn(parentPackage, parentClassName);

  while (parentFqn.length > 0) {
    const parent = allEntities.find(e => e.fqn === parentFqn);
    if (parent) {
      attrs = parent.attributes ? attrs.concat(parent.attributes) : attrs;
      parentPackage = parent.parentPackage ? parent.parentPackage : '';
      parentClassName = parent.parentClassName ? parent.parentClassName : '';
    } else {
      parentPackage = '';
      parentClassName = '';
    }
    parentFqn = composeParentFqn(parentPackage, parentClassName);
  }

  return attrs;
}

// Quick check; does not ensure entity is among non-base project entities
export function isBaseProjectEntity(entity: Entity, projectModel: ProjectModel) {

  if (!projectModel.baseProjectEntities) return false;

  const baseProjectEntities = Array.isArray(projectModel.baseProjectEntities)
    ? projectModel.baseProjectEntities
    : Object.values(projectModel.baseProjectEntities);

  if (baseProjectEntities.find(bpe => bpe.name === entity.name)){
    return true;
  }
  return false
}

function composeParentFqn(parentPackage: string | undefined, parentClassName: string | undefined): string {
  if (!parentClassName || !parentPackage) return '';
  if (parentPackage.length == 0 || parentClassName.length == 0) return '';
  return `${parentPackage}.${parentClassName}`;
}
