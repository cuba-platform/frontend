"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("./model");
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
function getAttributePermission(entityName, attributeName, perms, roles) {
    if (!perms || !roles)
        return 'DENY';
    if (hasRole(roles, model_1.RoleType.SUPER)) {
        return 'MODIFY';
    }
    var perm = getMaxAllowedAttrPerm(entityName, attributeName, perms);
    // return 'DENY' if no permission exist and user in STRICTLY_DENYING role
    if (hasRole(roles, model_1.RoleType.STRICTLY_DENYING) && perm === null) {
        return 'DENY';
    }
    return perm == null ? 'MODIFY' : perm.value;
}
exports.getAttributePermission = getAttributePermission;
/**
 * Define if operation (one of CRUD) on entity allowed or not for user
 *
 * @param entityName CUBA model entity
 * @param operation - operation to be checked (CRUD)
 * @param perms - list of user permissions
 * @param roles - list of user roles
 */
function isOperationAllowed(entityName, operation, perms, roles) {
    if (!perms || !roles)
        return false;
    if (hasRole(roles, model_1.RoleType.SUPER))
        return true;
    var perm = getMaxAllowedOpPerm(entityName, operation, perms);
    // readonly role not affect read operation
    if (hasRole(roles, model_1.RoleType.READONLY) && operation !== 'read') {
        // operation (except read) is disabled for readonly role if no perm is set
        if (perm == null)
            return false;
    }
    if (hasRole(roles, model_1.RoleType.DENYING) || hasRole(roles, model_1.RoleType.STRICTLY_DENYING)) {
        // operation is disabled for denying roles if no perm is set
        if (perm == null)
            return false;
    }
    return perm == null || perm.value !== 'DENY' ? true : false;
}
exports.isOperationAllowed = isOperationAllowed;
function getMaxAllowedOpPerm(entityName, operation, perms) {
    var opFqn = entityName + ":" + operation;
    return perms
        .filter(function (perm) { return perm.type === model_1.PermissionType.ENTITY_OP && perm.target === opFqn; })
        .reduce(function (resultPerm, perm) {
        // assign result perm to maximum allowed permission between current and resultPerm
        if (resultPerm == null)
            return perm;
        if (perm.value === 'ALLOW')
            return perm;
        return resultPerm;
    }, null);
}
function getMaxAllowedAttrPerm(entityName, attributeName, perms) {
    var attrFqn = entityName + ":" + attributeName;
    return perms
        .filter(function (perm) { return perm.type === model_1.PermissionType.ENTITY_ATTR && perm.target === attrFqn; })
        .reduce(function (resultPerm, perm) {
        if (resultPerm === null)
            return perm;
        // assign result perm to maximum allowed permission between current and resultPerm
        var resultPermValue = resultPerm.value;
        var currentPermValue = perm.value;
        if (currentPermValue === 'MODIFY')
            return perm;
        if (currentPermValue === 'VIEW' && resultPermValue === 'DENY')
            return perm;
        return resultPerm;
    }, null);
}
function hasRole(roles, roleType) {
    return roles.some(function (r) { return r.roleType === roleType; });
}
