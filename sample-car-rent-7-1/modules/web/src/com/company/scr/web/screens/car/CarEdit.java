package com.company.scr.web.screens.car;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.Car;

@UiController("scr$Car.edit")
@UiDescriptor("car-edit.xml")
@EditedEntityContainer("carDc")
@LoadDataBeforeShow
public class CarEdit extends StandardEditor<Car> {
}