package com.company.scr.web.screens.compositiono2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositionO2MTestEntity;

@UiController("scr_CompositionO2MTestEntity.browse")
@UiDescriptor("composition-o2m-test-entity-browse.xml")
@LookupComponent("compositionO2MTestEntitiesTable")
@LoadDataBeforeShow
public class CompositionO2MTestEntityBrowse extends StandardLookup<CompositionO2MTestEntity> {
}
