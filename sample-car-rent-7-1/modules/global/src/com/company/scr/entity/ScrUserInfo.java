package com.company.scr.entity;

import com.haulmont.chile.core.annotations.MetaClass;
import com.haulmont.chile.core.annotations.MetaProperty;
import com.haulmont.cuba.core.entity.BaseUuidEntity;

import java.util.List;


/**
 * Non-persistent user info with additional fields for using in REST.
 */
@MetaClass(name = "ScrUserInfo")
public class ScrUserInfo extends BaseUuidEntity {

    @MetaProperty
    String firstName;

    @MetaProperty
    String lastName;

    @MetaProperty
    List<Car> favouriteCars;

    public ScrUserInfo(String firstName, String lastName, List<Car> favouriteCars) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.favouriteCars = favouriteCars;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public List<Car> getFavouriteCars() {
        return favouriteCars;
    }

    public void setFavouriteCars(List<Car> favouriteCars) {
        this.favouriteCars = favouriteCars;
    }
}
