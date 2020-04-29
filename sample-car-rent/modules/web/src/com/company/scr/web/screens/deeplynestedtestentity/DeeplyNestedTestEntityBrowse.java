package com.company.scr.web.screens.deeplynestedtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DeeplyNestedTestEntity;

@UiController("scr_DeeplyNestedTestEntity.browse")
@UiDescriptor("deeply-nested-test-entity-browse.xml")
@LookupComponent("deeplyNestedTestEntitiesTable")
@LoadDataBeforeShow
public class DeeplyNestedTestEntityBrowse extends StandardLookup<DeeplyNestedTestEntity> {
}
