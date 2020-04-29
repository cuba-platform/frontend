package com.company.scr.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.chile.core.annotations.NamePattern;

@NamePattern("%s|name")
@Table(name = "SCR_GARAGE")
@Entity(name = "scr$Garage")
public class Garage extends StandardEntity {
    private static final long serialVersionUID = 7433304599326178836L;

    @Column(name = "NAME", nullable = false)
    protected String name;

    @Column(name = "CAPACITY")
    protected Integer capacity;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getCapacity() {
        return capacity;
    }


}