package com.company.scr.web.screens.embeddedtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.EmbeddedTestEntity;

@UiController("scr_EmbeddedTestEntity.edit")
@UiDescriptor("embedded-test-entity-edit.xml")
@EditedEntityContainer("embeddedTestEntityDc")
@LoadDataBeforeShow
public class EmbeddedTestEntityEdit extends StandardEditor<EmbeddedTestEntity> {
}