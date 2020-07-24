package com.company.scr.security;

import com.haulmont.cuba.security.app.role.AnnotatedRoleDefinition;
import com.haulmont.cuba.security.app.role.annotation.Role;
import com.haulmont.cuba.security.role.EntityAttributePermissionsContainer;
import com.haulmont.cuba.security.role.EntityPermissionsContainer;
import com.haulmont.cuba.security.role.SpecificPermissionsContainer;
import org.jetbrains.annotations.NotNull;

@Role(name = RestAdminsRole.NAME, securityScope = "REST", isSuper = true)
public class RestAdminsRole extends AnnotatedRoleDefinition {

    public static final String NAME = "rest-admins";

    @NotNull
    @Override
    public EntityPermissionsContainer entityPermissions() {
        return super.entityPermissions();
    }

    @NotNull
    @Override
    public EntityAttributePermissionsContainer entityAttributePermissions() {
        return super.entityAttributePermissions();
    }

    @NotNull
    @Override
    public SpecificPermissionsContainer specificPermissions() {
        return super.specificPermissions();
    }

}

