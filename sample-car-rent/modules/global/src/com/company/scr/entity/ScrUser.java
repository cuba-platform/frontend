package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.annotation.Extends;
import com.haulmont.cuba.security.entity.User;

import javax.persistence.Column;
import javax.persistence.Entity;

@NamePattern("#getCaption|login,name")
@Entity(name = "scr$User")
@Extends(User.class)
public class ScrUser extends User {

    private static final long serialVersionUID = 5658573923145190791L;

    @Column(name = "phone")
    protected String phone;

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

}