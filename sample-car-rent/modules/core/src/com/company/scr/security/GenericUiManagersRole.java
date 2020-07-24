package com.company.scr.security;

import com.company.scr.entity.Car;
import com.haulmont.cuba.security.app.role.AnnotatedRoleDefinition;
import com.haulmont.cuba.security.app.role.annotation.EntityAccess;
import com.haulmont.cuba.security.app.role.annotation.EntityAttributeAccess;
import com.haulmont.cuba.security.app.role.annotation.Role;
import com.haulmont.cuba.security.app.role.annotation.ScreenAccess;
import com.haulmont.cuba.security.entity.EntityOp;
import com.haulmont.cuba.security.role.EntityAttributePermissionsContainer;
import com.haulmont.cuba.security.role.EntityPermissionsContainer;
import com.haulmont.cuba.security.role.ScreenPermissionsContainer;
import org.jetbrains.annotations.NotNull;

@Role(name = GenericUiManagersRole.NAME)
public class GenericUiManagersRole extends AnnotatedRoleDefinition {

    public static final String NAME = "generic-ui-managers";

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
    @ScreenAccess(screenIds = {"application", "scr$Car.edit", "scr$Car.browse"})
    public ScreenPermissionsContainer screenPermissions() {
        return super.screenPermissions();
    }


}