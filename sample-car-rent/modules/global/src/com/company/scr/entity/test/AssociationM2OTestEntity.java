package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@NamePattern("%s|name")
@Table(name = "SCR_ASSOCIATION_M2O_TEST_ENTITY")
@Entity(name = "scr_AssociationM2OTestEntity")
public class AssociationM2OTestEntity extends StandardEntity {
    private static final long serialVersionUID = 5399618841477165190L;

    @Column(name = "NAME")
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
