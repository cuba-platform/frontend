package com.company.scr.web.screens.datatypestestentity3;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity3;

@UiController("scr_DatatypesTestEntity3.browse")
@UiDescriptor("datatypes-test-entity3-browse.xml")
@LookupComponent("datatypesTestEntity3sTable")
@LoadDataBeforeShow
public class DatatypesTestEntity3Browse extends StandardLookup<DatatypesTestEntity3> {
}