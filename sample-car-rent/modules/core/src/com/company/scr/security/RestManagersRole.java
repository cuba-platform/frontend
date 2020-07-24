package com.company.scr.security;

import com.company.scr.entity.Car;
import com.haulmont.cuba.security.app.role.AnnotatedRoleDefinition;
import com.haulmont.cuba.security.app.role.annotation.EntityAccess;
import com.haulmont.cuba.security.app.role.annotation.EntityAttributeAccess;
import com.haulmont.cuba.security.app.role.annotation.Role;
import com.haulmont.cuba.security.app.role.annotation.SpecificAccess;
import com.haulmont.cuba.security.entity.EntityOp;
import com.haulmont.cuba.security.role.EntityAttributePermissionsContainer;
import com.haulmont.cuba.security.role.EntityPermissionsContainer;
import com.haulmont.cuba.security.role.SpecificPermissionsContainer;
import org.jetbrains.annotations.NotNull;

@Role(name = RestManagersRole.NAME, securityScope = "REST")
public class RestManagersRole extends AnnotatedRoleDefinition {

    public static final String NAME = "rest-managers";

    @NotNull
    @Override
    @EntityAccess(entityClass = Car.class, operations = {EntityOp.CREATE, EntityOp.READ, EntityOp.UPDATE, EntityOp.DELETE})
    public EntityPermissionsContainer entityPermissions() {
        return super.entityPermissions();
    }

    @NotNull
    @Override
    @EntityAttributeAccess(entityClass = Car.class, modify = {"carType", "manufacturer", "regNumber", "model"})
    public EntityAttributePermissionsContainer entityAttributePermissions() {
        return super.entityAttributePermissions();
    }

    @NotNull
    @Override
    @SpecificAccess(permissions = {"cuba.restApi.enabled", "cuba.restApi.fileUpload.enabled"})
    public SpecificPermissionsContainer specificPermissions() {
        return super.specificPermissions();
    }

}

