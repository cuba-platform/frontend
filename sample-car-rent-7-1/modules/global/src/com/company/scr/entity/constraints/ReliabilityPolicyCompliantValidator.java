package com.company.scr.entity.constraints;

import com.company.scr.entity.Car;
import com.haulmont.cuba.core.global.AppBeans;
import com.haulmont.cuba.core.global.EntityStates;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class ReliabilityPolicyCompliantValidator implements ConstraintValidator<ReliabilityPolicyCompliant, Car> {
    private static final int mileageTreshold = 100_000;

    @Override
    public void initialize(ReliabilityPolicyCompliant constraintAnnotation) {
        // do nothing
    }

    @Override
    public boolean isValid(Car car, ConstraintValidatorContext context) {
        EntityStates entityStates = AppBeans.get("cuba_EntityStates");

        if (!entityStates.isLoaded(car, "manufactureDate")
                || !entityStates.isLoaded(car, "mileage")
                || car.getManufactureDate() == null
                || car.getMileage() == null) {
            return true;
        }

        return !(car.getManufactureDate().before(getDateThreshold()) && car.getMileage() < mileageTreshold);
    }

    private Date getDateThreshold() {
        Calendar c = new GregorianCalendar();
        c.add(Calendar.YEAR, -10);
        return c.getTime();
    }
}
