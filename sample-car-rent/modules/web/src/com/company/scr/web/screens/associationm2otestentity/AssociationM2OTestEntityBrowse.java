package com.company.scr.web.screens.associationm2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationM2OTestEntity;

@UiController("scr_AssociationM2OTestEntity.browse")
@UiDescriptor("association-m2o-test-entity-browse.xml")
@LookupComponent("associationM2OTestEntitiesTable")
@LoadDataBeforeShow
public class AssociationM2OTestEntityBrowse extends StandardLookup<AssociationM2OTestEntity> {
}
