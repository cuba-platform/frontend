import {
  BasePermissionValue,
  EntityAttrPermissionValue,
  EntityOperationType,
  PermissionInfo,
  PermissionType,
  RoleInfo,
  RoleType
} from './model';

/**
 *
 * Define which type of attribute render allowed for user
 *
 * @param entityName CUBA model entity
 * @param attributeName
 * @param perms - list of user permissions
 * @param roles - list of user roles
 * @return attribute could be not allowed to display (DENY), allowed for modification (MODIFY)
 * or allowed in read only mode (VIEW).
 */
export function getAttributePermission(entityName: string,
                                       attributeName: string,
                                       perms: PermissionInfo[] | undefined,
                                       roles: RoleInfo[] | undefined): EntityAttrPermissionValue {

  if (!perms || !roles) return 'DENY';

  if (hasRole(roles, RoleType.SUPER)) {
    return 'MODIFY';
  }

  const perm = getMaxAllowedAttrPerm(entityName, attributeName, perms);

  // return 'DENY' if no permission exist and user in STRICTLY_DENYING role
  if (hasRole(roles, RoleType.STRICTLY_DENYING) && perm === null) {
    return 'DENY';
  }

  return perm == null ? 'MODIFY' : perm.value as EntityAttrPermissionValue;
}

/**
 * Define if operation (one of CRUD) on entity allowed or not for user
 *
 * @param entityName CUBA model entity
 * @param operation - operation to be checked (CRUD)
 * @param perms - list of user permissions
 * @param roles - list of user roles
 */
export function isOperationAllowed(entityName: string,
                                   operation: EntityOperationType,
                                   perms: PermissionInfo[] | undefined,
                                   roles: RoleInfo[] | undefined): boolean {

  if (!perms || !roles) return false;

  if (hasRole(roles, RoleType.SUPER)) return true;

  const perm = getMaxAllowedOpPerm(entityName, operation, perms);

  // readonly role not affect read operation
  if (hasRole(roles, RoleType.READONLY) && operation !== 'read') {
    // operation (except read) is disabled for readonly role if no perm is set
    if (perm == null) return false;
  }

  if (hasRole(roles, RoleType.DENYING) || hasRole(roles, RoleType.STRICTLY_DENYING)) {
    // operation is disabled for denying roles if no perm is set
    if (perm == null) return false;
  }

  return perm == null || perm.value as BasePermissionValue !== 'DENY' ? true : false;
}

function getMaxAllowedOpPerm(entityName: string,
                             operation: EntityOperationType,
                             perms: PermissionInfo[]): PermissionInfo | null {

  const opFqn = `${entityName}:${operation}`;

  return perms
    .filter(perm => perm.type === PermissionType.ENTITY_OP && perm.target === opFqn)
    .reduce((resultPerm, perm) => {
        // assign result perm to maximum allowed permission between current and resultPerm
        if (resultPerm == null) return perm;
        if (perm.value as BasePermissionValue === 'ALLOW') return perm;
        return resultPerm;
    }, null);
}

function getMaxAllowedAttrPerm(entityName: string,
                               attributeName: string,
                               perms: PermissionInfo[]): PermissionInfo | null {

  const attrFqn = `${entityName}:${attributeName}`;

  return perms
    .filter(perm => perm.type === PermissionType.ENTITY_ATTR && perm.target === attrFqn)
    .reduce((resultPerm, perm) => {

      if (resultPerm === null) return perm;

      // assign result perm to maximum allowed permission between current and resultPerm
      const resultPermValue: EntityAttrPermissionValue = resultPerm.value as EntityAttrPermissionValue;
      const currentPermValue: EntityAttrPermissionValue = perm.value as EntityAttrPermissionValue;

      if (currentPermValue === 'MODIFY') return perm;
      if (currentPermValue === 'VIEW' && resultPermValue === 'DENY') return perm;
      return resultPerm;

    }, null);
}

function hasRole(roles: RoleInfo[], roleType: RoleType): boolean {
  return roles.some(r => r.roleType === roleType);
}
