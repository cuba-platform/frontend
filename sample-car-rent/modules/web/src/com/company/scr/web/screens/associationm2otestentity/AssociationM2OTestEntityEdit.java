package com.company.scr.web.screens.associationm2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationM2OTestEntity;

@UiController("scr_AssociationM2OTestEntity.edit")
@UiDescriptor("association-m2o-test-entity-edit.xml")
@EditedEntityContainer("associationM2OTestEntityDc")
@LoadDataBeforeShow
public class AssociationM2OTestEntityEdit extends StandardEditor<AssociationM2OTestEntity> {
}
