package com.company.scr.web.screens.datatypestestentity;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity;

@UiController("scr_DatatypesTestEntity.browse")
@UiDescriptor("datatypes-test-entity-browse.xml")
@LookupComponent("datatypesTestEntitiesTable")
@LoadDataBeforeShow
public class DatatypesTestEntityBrowse extends StandardLookup<DatatypesTestEntity> {
}
