package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@NamePattern("%s|name")
@Table(name = "SCR_SPARE_PART_O2O")
@Entity(name = "scr_SparePartO2O")
public class SparePartO2O extends StandardEntity {
    private static final long serialVersionUID = 7630390445988946146L;

    @Column(name = "NAME")
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
