package com.company.scr.web.screens.compositiono2mtestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositionO2MTestEntity;

@UiController("scr_CompositionO2MTestEntity.edit")
@UiDescriptor("composition-o2m-test-entity-edit.xml")
@EditedEntityContainer("compositionO2MTestEntityDc")
@LoadDataBeforeShow
public class CompositionO2MTestEntityEdit extends StandardEditor<CompositionO2MTestEntity> {
}
