package com.company.scr.web.screens.associationo2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.AssociationO2OTestEntity;

@UiController("scr_AssociationO2OTestEntity.browse")
@UiDescriptor("association-o2o-test-entity-browse.xml")
@LookupComponent("associationO2OTestEntitiesTable")
@LoadDataBeforeShow
public class AssociationO2OTestEntityBrowse extends StandardLookup<AssociationO2OTestEntity> {
}
