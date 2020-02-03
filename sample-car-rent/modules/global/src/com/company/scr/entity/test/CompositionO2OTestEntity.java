package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@NamePattern("%s|name")
@Table(name = "SCR_COMPOSITION_O2O_TEST_ENTITY")
@Entity(name = "scr_CompositionO2OTestEntity")
public class CompositionO2OTestEntity extends StandardEntity {
    private static final long serialVersionUID = -3212555290356930151L;

    @Column(name = "NAME")
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
