package com.company.scr.web.screens.associationm2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationM2MTestEntity;

@UiController("scr_AssociationM2MTestEntity.browse")
@UiDescriptor("association-m2m-test-entity-browse.xml")
@LookupComponent("associationM2MTestEntitiesTable")
@LoadDataBeforeShow
public class AssociationM2MTestEntityBrowse extends StandardLookup<AssociationM2MTestEntity> {
}
