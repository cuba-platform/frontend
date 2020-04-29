package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.Lookup;
import com.haulmont.cuba.core.entity.annotation.LookupType;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_SPARE_PART")
@Entity(name = "scr$SparePart")
public class SparePart extends StandardEntity {
    private static final long serialVersionUID = -7787453227264087765L;

    @Column(name = "NAME")
    protected String name;

    @Lookup(type = LookupType.SCREEN, actions = {"lookup", "open", "clear"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPARE_PARTS_ID")
    protected SparePart spareParts;

    public SparePart getSpareParts() {
        return spareParts;
    }

    public void setSpareParts(SparePart spareParts) {
        this.spareParts = spareParts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}