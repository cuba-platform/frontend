package com.company.scr.web.screens.associationo2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationO2MTestEntity;

@UiController("scr_AssociationO2MTestEntity.browse")
@UiDescriptor("association-o2m-test-entity-browse.xml")
@LookupComponent("associationO2MTestEntitiesTable")
@LoadDataBeforeShow
public class AssociationO2MTestEntityBrowse extends StandardLookup<AssociationO2MTestEntity> {
}
