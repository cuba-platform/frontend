package com.company.scr.web.screens.compositiono2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositionO2OTestEntity;

@UiController("scr_CompositionO2OTestEntity.browse")
@UiDescriptor("composition-o2o-test-entity-browse.xml")
@LookupComponent("compositionO2OTestEntitiesTable")
@LoadDataBeforeShow
public class CompositionO2OTestEntityBrowse extends StandardLookup<CompositionO2OTestEntity> {
}
