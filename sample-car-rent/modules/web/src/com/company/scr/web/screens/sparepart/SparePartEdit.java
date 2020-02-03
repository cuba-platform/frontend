package com.company.scr.web.screens.sparepart;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.SparePart;

@UiController("scr$SparePart.edit")
@UiDescriptor("spare-part-edit.xml")
@EditedEntityContainer("sparePartDc")
@LoadDataBeforeShow
public class SparePartEdit extends StandardEditor<SparePart> {
}