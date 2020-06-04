package com.company.scr.web.screens.stringidtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.StringIdTestEntity;

@UiController("scr_StringIdTestEntity.edit")
@UiDescriptor("string-id-test-entity-edit.xml")
@EditedEntityContainer("stringIdTestEntityDc")
@LoadDataBeforeShow
public class StringIdTestEntityEdit extends StandardEditor<StringIdTestEntity> {
}