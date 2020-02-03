package com.company.scr.web.screens.associationm2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationM2MTestEntity;

@UiController("scr_AssociationM2MTestEntity.edit")
@UiDescriptor("association-m2m-test-entity-edit.xml")
@EditedEntityContainer("associationM2MTestEntityDc")
@LoadDataBeforeShow
public class AssociationM2MTestEntityEdit extends StandardEditor<AssociationM2MTestEntity> {
}
