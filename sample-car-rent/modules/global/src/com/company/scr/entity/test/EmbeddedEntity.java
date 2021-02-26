package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.MetaClass;
import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.EmbeddableEntity;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@MetaClass(name = "scr_EmbeddedEntity")
@Embeddable
@NamePattern("%s|name")
public class EmbeddedEntity extends EmbeddableEntity {
    private static final long serialVersionUID = -5040943962684470375L;

    @Column(name = "NAME")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}