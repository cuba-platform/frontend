package com.company.scr.web.screens.datatypestestentity2;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity2;

@UiController("scr_DatatypesTestEntity2.edit")
@UiDescriptor("datatypes-test-entity2-edit.xml")
@EditedEntityContainer("datatypesTestEntity2Dc")
@LoadDataBeforeShow
public class DatatypesTestEntity2Edit extends StandardEditor<DatatypesTestEntity2> {
}