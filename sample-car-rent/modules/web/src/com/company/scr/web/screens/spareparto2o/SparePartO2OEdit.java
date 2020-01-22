package com.company.scr.web.screens.spareparto2o;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePartO2O;

@UiController("scr_SparePartO2O.edit")
@UiDescriptor("spare-part-o2o-edit.xml")
@EditedEntityContainer("sparePartO2ODc")
@LoadDataBeforeShow
public class SparePartO2OEdit extends StandardEditor<SparePartO2O> {
}
