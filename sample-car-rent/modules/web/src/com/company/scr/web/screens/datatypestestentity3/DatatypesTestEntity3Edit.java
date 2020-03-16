package com.company.scr.web.screens.datatypestestentity3;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity3;

@UiController("scr_DatatypesTestEntity3.edit")
@UiDescriptor("datatypes-test-entity3-edit.xml")
@EditedEntityContainer("datatypesTestEntity3Dc")
@LoadDataBeforeShow
public class DatatypesTestEntity3Edit extends StandardEditor<DatatypesTestEntity3> {
}