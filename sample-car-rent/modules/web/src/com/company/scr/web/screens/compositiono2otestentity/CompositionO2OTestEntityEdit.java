package com.company.scr.web.screens.compositiono2otestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositionO2OTestEntity;

@UiController("scr_CompositionO2OTestEntity.edit")
@UiDescriptor("composition-o2o-test-entity-edit.xml")
@EditedEntityContainer("compositionO2OTestEntityDc")
@LoadDataBeforeShow
public class CompositionO2OTestEntityEdit extends StandardEditor<CompositionO2OTestEntity> {
}
