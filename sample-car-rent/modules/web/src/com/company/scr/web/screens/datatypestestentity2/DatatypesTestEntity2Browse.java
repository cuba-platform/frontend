package com.company.scr.web.screens.datatypestestentity2;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.test.DatatypesTestEntity2;

@UiController("scr_DatatypesTestEntity2.browse")
@UiDescriptor("datatypes-test-entity2-browse.xml")
@LookupComponent("datatypesTestEntity2sTable")
@LoadDataBeforeShow
public class DatatypesTestEntity2Browse extends StandardLookup<DatatypesTestEntity2> {
}