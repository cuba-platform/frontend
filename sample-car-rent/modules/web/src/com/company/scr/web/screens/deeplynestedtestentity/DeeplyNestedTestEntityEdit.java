package com.company.scr.web.screens.deeplynestedtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DeeplyNestedTestEntity;

@UiController("scr_DeeplyNestedTestEntity.edit")
@UiDescriptor("deeply-nested-test-entity-edit.xml")
@EditedEntityContainer("deeplyNestedTestEntityDc")
@LoadDataBeforeShow
public class DeeplyNestedTestEntityEdit extends StandardEditor<DeeplyNestedTestEntity> {
}
