package com.company.scr.web.screens.stringidtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.StringIdTestEntity;

@UiController("scr_StringIdTestEntity.browse")
@UiDescriptor("string-id-test-entity-browse.xml")
@LookupComponent("stringIdTestEntitiesTable")
@LoadDataBeforeShow
public class StringIdTestEntityBrowse extends StandardLookup<StringIdTestEntity> {
}