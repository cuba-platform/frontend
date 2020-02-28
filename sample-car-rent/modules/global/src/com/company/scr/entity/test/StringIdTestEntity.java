package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.BaseStringIdEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@NamePattern("%s|description")
@Table(name = "SCR_STRING_ID_TEST_ENTITY")
@Entity(name = "scr_StringIdTestEntity")
public class StringIdTestEntity extends BaseStringIdEntity {
    private static final long serialVersionUID = -5918980569216468585L;

    @Id
    @Column(name = "IDENTIFIER", nullable = false, length = 10)
    protected String identifier;

    @Column(name = "DESCRIPTION")
    protected String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public void setId(String id) {
        this.identifier = id;
    }

    @Override
    public String getId() {
        return identifier;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}