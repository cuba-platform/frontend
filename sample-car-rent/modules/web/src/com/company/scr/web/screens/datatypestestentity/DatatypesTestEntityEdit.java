package com.company.scr.web.screens.datatypestestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity;

@UiController("scr_DatatypesTestEntity.edit")
@UiDescriptor("datatypes-test-entity-edit.xml")
@EditedEntityContainer("datatypesTestEntityDc")
@LoadDataBeforeShow
public class DatatypesTestEntityEdit extends StandardEditor<DatatypesTestEntity> {
}
