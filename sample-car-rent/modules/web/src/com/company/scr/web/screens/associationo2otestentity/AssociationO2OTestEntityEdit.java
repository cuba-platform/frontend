package com.company.scr.web.screens.associationo2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationO2OTestEntity;

@UiController("scr_AssociationO2OTestEntity.edit")
@UiDescriptor("association-o2o-test-entity-edit.xml")
@EditedEntityContainer("associationO2OTestEntityDc")
@LoadDataBeforeShow
public class AssociationO2OTestEntityEdit extends StandardEditor<AssociationO2OTestEntity> {
}
