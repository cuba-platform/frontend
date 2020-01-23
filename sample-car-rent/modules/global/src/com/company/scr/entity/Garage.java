package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;
import com.haulmont.cuba.security.entity.User;

import javax.persistence.*;
import java.time.LocalTime;
import java.util.List;

@NamePattern("%s|name")
@Table(name = "SCR_GARAGE")
@Entity(name = "scr$Garage")
public class Garage extends StandardEntity {
    private static final long serialVersionUID = 7433304599326178836L;

    @Column(name = "NAME", nullable = false)
    protected String name;

    @Column(name = "ADDRESS")
    protected String address;

    @JoinTable(name = "SCR_GARAGE_USER_LINK",
            joinColumns = @JoinColumn(name = "GARAGE_ID"),
            inverseJoinColumns = @JoinColumn(name = "USER_ID"))
    @OnDelete(DeletePolicy.CASCADE)
    @ManyToMany
    protected List<User> personnel;

    @Column(name = "CAPACITY")
    protected Integer capacity;

    @Column(name = "VAN_ENTRY")
    protected Boolean vanEntry;

    @Column(name = "WORKING_HOURS_FROM")
    protected LocalTime workingHoursFrom;

    @Column(name = "WORKING_HOURS_TO")
    protected LocalTime workingHoursTo;

    public LocalTime getWorkingHoursTo() {
        return workingHoursTo;
    }

    public void setWorkingHoursTo(LocalTime workingHoursTo) {
        this.workingHoursTo = workingHoursTo;
    }

    public LocalTime getWorkingHoursFrom() {
        return workingHoursFrom;
    }

    public void setWorkingHoursFrom(LocalTime workingHoursFrom) {
        this.workingHoursFrom = workingHoursFrom;
    }

    public Boolean getVanEntry() {
        return vanEntry;
    }

    public void setVanEntry(Boolean vanEntry) {
        this.vanEntry = vanEntry;
    }

    public List<User> getPersonnel() {
        return personnel;
    }

    public void setPersonnel(List<User> personnel) {
        this.personnel = personnel;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

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