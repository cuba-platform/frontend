package com.company.scr.entity.constraints;

import com.company.scr.entity.Car;
import com.haulmont.cuba.core.global.AppBeans;
import com.haulmont.cuba.core.global.EntityStates;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PurchasedAfterManufacturedValidator implements ConstraintValidator<PurchasedAfterManufactured, Car> {

    public void initialize(PurchasedAfterManufactured constraint) {
        // do nothing
    }

    public boolean isValid(Car car, ConstraintValidatorContext context) {
        EntityStates entityStates = AppBeans.get("cuba_EntityStates");

        if (!entityStates.isLoaded(car, "manufactureDate")
                || !entityStates.isLoaded(car, "purchaseDate")
                || car.getManufactureDate() == null
                || car.getPurchaseDate() == null) {
            return true;
        } else {
            return car.getManufactureDate().before(car.getPurchaseDate());
        }
    }
}
