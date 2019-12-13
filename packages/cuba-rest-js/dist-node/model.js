"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PermissionType;
(function (PermissionType) {
    PermissionType["SCREEN"] = "SCREEN";
    PermissionType["ENTITY_OP"] = "ENTITY_OP";
    PermissionType["ENTITY_ATTR"] = "ENTITY_ATTR";
    PermissionType["SPECIFIC"] = "SPECIFIC";
    PermissionType["UI"] = "UI";
})(PermissionType = exports.PermissionType || (exports.PermissionType = {}));
var RoleType;
(function (RoleType) {
    RoleType["STANDARD"] = "STANDARD";
    RoleType["SUPER"] = "SUPER";
    RoleType["READONLY"] = "READONLY";
    RoleType["DENYING"] = "DENYING";
    RoleType["STRICTLY_DENYING"] = "STRICTLY_DENYING";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
var PredefinedView;
(function (PredefinedView) {
    PredefinedView["MINIMAL"] = "_minimal";
    PredefinedView["LOCAL"] = "_local";
    PredefinedView["BASE"] = "_base";
})(PredefinedView = exports.PredefinedView || (exports.PredefinedView = {}));
