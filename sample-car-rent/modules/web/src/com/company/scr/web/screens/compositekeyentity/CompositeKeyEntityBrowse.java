package com.company.scr.web.screens.compositekeyentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.CompositeKeyEntity;

@UiController("scr_CompositeKeyEntity.browse")
@UiDescriptor("composite-key-entity-browse.xml")
@LookupComponent("compositeKeyEntitiesTable")
@LoadDataBeforeShow
public class CompositeKeyEntityBrowse extends StandardLookup<CompositeKeyEntity> {
}
