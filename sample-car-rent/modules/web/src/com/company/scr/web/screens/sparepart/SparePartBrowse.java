package com.company.scr.web.screens.sparepart;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePart;

@UiController("scr$SparePart.browse")
@UiDescriptor("spare-part-browse.xml")
@LookupComponent("sparePartsTable")
@LoadDataBeforeShow
public class SparePartBrowse extends StandardLookup<SparePart> {
}