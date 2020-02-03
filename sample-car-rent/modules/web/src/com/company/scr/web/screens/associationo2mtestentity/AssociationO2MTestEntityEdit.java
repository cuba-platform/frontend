package com.company.scr.web.screens.associationo2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationO2MTestEntity;

@UiController("scr_AssociationO2MTestEntity.edit")
@UiDescriptor("association-o2m-test-entity-edit.xml")
@EditedEntityContainer("associationO2MTestEntityDc")
@LoadDataBeforeShow
public class AssociationO2MTestEntityEdit extends StandardEditor<AssociationO2MTestEntity> {
}
