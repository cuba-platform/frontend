package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_ASSOCIATION_O2O_TEST_ENTITY")
@Entity(name = "scr_AssociationO2OTestEntity")
public class AssociationO2OTestEntity extends StandardEntity {
    private static final long serialVersionUID = 5841496721725015919L;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "associationO2Oattr")
    protected DatatypesTestEntity datatypesTestEntity;

    @Column(name = "NAME")
    protected String name;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "associationO2Oattr")
    protected DeeplyNestedTestEntity deeplyNestedTestEntity;

    public DeeplyNestedTestEntity getDeeplyNestedTestEntity() {
        return deeplyNestedTestEntity;
    }

    public void setDeeplyNestedTestEntity(DeeplyNestedTestEntity deeplyNestedTestEntity) {
        this.deeplyNestedTestEntity = deeplyNestedTestEntity;
    }

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
