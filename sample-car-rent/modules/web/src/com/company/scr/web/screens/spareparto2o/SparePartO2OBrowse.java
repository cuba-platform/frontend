package com.company.scr.web.screens.spareparto2o;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePartO2O;

@UiController("scr_SparePartO2O.browse")
@UiDescriptor("spare-part-o2o-browse.xml")
@LookupComponent("sparePartO2oesTable")
@LoadDataBeforeShow
public class SparePartO2OBrowse extends StandardLookup<SparePartO2O> {
}
