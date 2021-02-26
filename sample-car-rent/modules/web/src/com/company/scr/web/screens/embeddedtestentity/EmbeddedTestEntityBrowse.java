package com.company.scr.web.screens.embeddedtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.EmbeddedTestEntity;

@UiController("scr_EmbeddedTestEntity.browse")
@UiDescriptor("embedded-test-entity-browse.xml")
@LookupComponent("embeddedTestEntitiesTable")
@LoadDataBeforeShow
public class EmbeddedTestEntityBrowse extends StandardLookup<EmbeddedTestEntity> {
}