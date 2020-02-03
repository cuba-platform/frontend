package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;
import java.util.List;

@NamePattern("%s|name")
@Table(name = "SCR_ASSOCIATION_M2M_TEST_ENTITY")
@Entity(name = "scr_AssociationM2MTestEntity")
public class AssociationM2MTestEntity extends StandardEntity {
    private static final long serialVersionUID = -6636080468468139015L;

    @JoinTable(name = "SCR_DATATYPES_TEST_ENTITY_ASSOCIATION_M2M_TEST_ENTITY_LINK",
        joinColumns = @JoinColumn(name = "ASSOCIATION_M2_M_TEST_ENTITY_ID"),
        inverseJoinColumns = @JoinColumn(name = "DATATYPES_TEST_ENTITY_ID"))
    @ManyToMany
    protected List<DatatypesTestEntity> datatypesTestEntities;

    @Column(name = "NAME")
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<DatatypesTestEntity> getDatatypesTestEntities() {
        return datatypesTestEntities;
    }

    public void setDatatypesTestEntities(List<DatatypesTestEntity> datatypesTestEntities) {
        this.datatypesTestEntities = datatypesTestEntities;
    }
}
