package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_COMPOSITION_O2M_TEST_ENTITY")
@Entity(name = "scr_CompositionO2MTestEntity")
public class CompositionO2MTestEntity extends StandardEntity {
    private static final long serialVersionUID = 8835810718685346730L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATATYPES_TEST_ENTITY_ID")
    protected DatatypesTestEntity datatypesTestEntity;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "NAME")
    protected String name;

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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
