package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_DEEPLY_NESTED_TEST_ENTITY")
@Entity(name = "scr_DeeplyNestedTestEntity")
public class DeeplyNestedTestEntity extends StandardEntity {
    private static final long serialVersionUID = 626320190916759291L;

    @Column(name = "NAME")
    protected String name;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSOCIATION_O2_OATTR_ID")
    protected AssociationO2OTestEntity associationO2Oattr;

    public AssociationO2OTestEntity getAssociationO2Oattr() {
        return associationO2Oattr;
    }

    public void setAssociationO2Oattr(AssociationO2OTestEntity associationO2Oattr) {
        this.associationO2Oattr = associationO2Oattr;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
