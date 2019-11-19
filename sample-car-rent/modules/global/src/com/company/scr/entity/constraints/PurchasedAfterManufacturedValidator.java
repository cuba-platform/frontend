package com.company.scr.entity.constraints;

import com.company.scr.entity.Car;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Date;

public class PurchasedAfterManufacturedValidator implements ConstraintValidator<PurchasedAfterManufactured, Car> {
   public void initialize(PurchasedAfterManufactured constraint) {
       // do nothing
   }

   public boolean isValid(Car car, ConstraintValidatorContext context) {
       if (car.getManufactureDate() == null || car.getPurchaseDate() == null) {
           return true;
       } else {
           return car.getManufactureDate().before(car.getPurchaseDate());
       }
   }
}
