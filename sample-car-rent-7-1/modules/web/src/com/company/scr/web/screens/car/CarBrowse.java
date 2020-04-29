package com.company.scr.web.screens.car;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.Car;

@UiController("scr$Car.browse")
@UiDescriptor("car-browse.xml")
@LookupComponent("carsTable")
@LoadDataBeforeShow
public class CarBrowse extends StandardLookup<Car> {
}