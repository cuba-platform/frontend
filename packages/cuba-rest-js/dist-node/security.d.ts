import { EntityAttrPermissionValue, EntityOperationType, PermissionInfo, RoleInfo } from './model';
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
export declare function getAttributePermission(entityName: string, attributeName: string, perms: PermissionInfo[] | undefined, roles: RoleInfo[] | undefined): EntityAttrPermissionValue;
/**
 * Define if operation (one of CRUD) on entity allowed or not for user
 *
 * @param entityName CUBA model entity
 * @param operation - operation to be checked (CRUD)
 * @param perms - list of user permissions
 * @param roles - list of user roles
 */
export declare function isOperationAllowed(entityName: string, operation: EntityOperationType, perms: PermissionInfo[] | undefined, roles: RoleInfo[] | undefined): boolean;
