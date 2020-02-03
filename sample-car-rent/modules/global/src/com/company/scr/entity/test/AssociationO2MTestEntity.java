package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_ASSOCIATION_O2M_TEST_ENTITY")
@Entity(name = "scr_AssociationO2MTestEntity")
public class AssociationO2MTestEntity extends StandardEntity {
    private static final long serialVersionUID = 8764055571305243786L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATATYPES_TEST_ENTITY_ID")
    protected DatatypesTestEntity datatypesTestEntity;

    @Column(name = "NAME")
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DatatypesTestEntity getDatatypesTestEntity() {
        return datatypesTestEntity;
    }

    public void setDatatypesTestEntity(DatatypesTestEntity datatypesTestEntity) {
        this.datatypesTestEntity = datatypesTestEntity;
    }
}
