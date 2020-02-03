package com.company.scr.web.screens.garage;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.Garage;

@UiController("scr$Garage.edit")
@UiDescriptor("garage-edit.xml")
@EditedEntityContainer("garageDc")
@LoadDataBeforeShow
public class GarageEdit extends StandardEditor<Garage> {
}