package com.company.scr.web.screens.compositekeyentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositeKeyEntity;

@UiController("scr_CompositeKeyEntity.edit")
@UiDescriptor("composite-key-entity-edit.xml")
@EditedEntityContainer("compositeKeyEntityDc")
@LoadDataBeforeShow
public class CompositeKeyEntityEdit extends StandardEditor<CompositeKeyEntity> {
}
