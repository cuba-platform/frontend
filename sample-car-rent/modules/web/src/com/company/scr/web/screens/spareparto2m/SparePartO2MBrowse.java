package com.company.scr.web.screens.spareparto2m;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePartO2M;

@UiController("scr_SparePartO2M.browse")
@UiDescriptor("spare-part-o2m-browse.xml")
@LookupComponent("sparePartO2MsTable")
@LoadDataBeforeShow
public class SparePartO2MBrowse extends StandardLookup<SparePartO2M> {
}
