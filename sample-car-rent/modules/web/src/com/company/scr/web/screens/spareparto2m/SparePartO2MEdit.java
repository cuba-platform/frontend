package com.company.scr.web.screens.spareparto2m;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePartO2M;

@UiController("scr_SparePartO2M.edit")
@UiDescriptor("spare-part-o2m-edit.xml")
@EditedEntityContainer("sparePartO2MDc")
@LoadDataBeforeShow
public class SparePartO2MEdit extends StandardEditor<SparePartO2M> {
}
