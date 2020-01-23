package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_SPARE_PART_O2M")
@Entity(name = "scr_SparePartO2M")
public class SparePartO2M extends StandardEntity {
    private static final long serialVersionUID = -1002516501172153391L;

    @Column(name = "NAME")
    protected String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPARE_PART_ID")
    protected SparePart sparePart;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SparePart getSparePart() {
        return sparePart;
    }

    public void setSparePart(SparePart sparePart) {
        this.sparePart = sparePart;
    }
}
