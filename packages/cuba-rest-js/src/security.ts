import {
  AttributePermissionValue,
  EffectivePermsInfo,
  EntityAttrPermissionValue,
  EntityOperationType,
  EntityPermissionValue,
  Permission
} from './model';

// noinspection JSUnusedGlobalSymbols
/**
 *
 * Define which type of attribute render allowed for user
 *
 * @param entityName CUBA model entity
 * @param attributeName
 * @param perms - user effective permissions
 * @return attribute could be not allowed to display (DENY), allowed for modification (MODIFY)
 * or allowed in read only mode (VIEW).
 */
export function getAttributePermission(entityName: string,
                                       attributeName: string,
                                       perms?: EffectivePermsInfo): EntityAttrPermissionValue {

  if (!perms) return 'DENY';
  const {entityAttributes} = perms.explicitPermissions;

  // find strict perm match 'car:engine'
  let explicitPerm: Permission<AttributePermissionValue> =
    entityAttributes.find(perm => perm.target === `${entityName}:${attributeName}`);
  if (explicitPerm != null) return convertAttributePermValue(explicitPerm.value);

  // find attribute wildcard perm match 'car:*'
  explicitPerm = entityAttributes.find(perm => perm.target === `${entityName}:*`);
  if (explicitPerm != null) return convertAttributePermValue(explicitPerm.value);

  // find pure wildcard perm match '*:*'
  explicitPerm = entityAttributes.find(perm => perm.target === `*:*`);
  if (explicitPerm != null) return convertAttributePermValue(explicitPerm.value);

  return perms.undefinedPermissionPolicy === 'ALLOW' ? 'MODIFY' : 'DENY';
}

// noinspection JSUnusedGlobalSymbols
/**
 * Define if operation (one of CRUD) on entity allowed or not for user
 *
 * @param entityName CUBA model entity
 * @param operation - operation to be checked (CRUD)
 * @param perms - user effective permissions
 */
export function isOperationAllowed(entityName: string,
                                   operation: EntityOperationType,
                                   perms?: EffectivePermsInfo): boolean {

  if (!perms) return false;
  const {entities} = perms.explicitPermissions;

  // find strict perm match 'car:read'
  let explicitPerm: Permission<EntityPermissionValue> =
    entities.find(perm => perm.target === `${entityName}:${operation}`);
  if (explicitPerm != null) return explicitPerm.value === 1;

  // find operation wildcard perm match 'car:*'
  explicitPerm = entities.find(perm => perm.target === `${entityName}:*`);
  if (explicitPerm != null) return explicitPerm.value === 1;

  // find pure wildcard perm match '*:*'
  explicitPerm = entities.find(perm => perm.target === `*:*`);
  if (explicitPerm != null) return explicitPerm.value === 1;

  return perms.undefinedPermissionPolicy === 'ALLOW';
}

function convertAttributePermValue(val: AttributePermissionValue): EntityAttrPermissionValue {
  switch (val) {
    case 2: return 'MODIFY';
    case 1: return 'VIEW';
    default: return 'DENY';
  }
}
