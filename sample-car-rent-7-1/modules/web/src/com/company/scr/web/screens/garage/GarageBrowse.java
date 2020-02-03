package com.company.scr.web.screens.garage;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.Garage;

@UiController("scr$Garage.browse")
@UiDescriptor("garage-browse.xml")
@LookupComponent("garagesTable")
@LoadDataBeforeShow
public class GarageBrowse extends StandardLookup<Garage> {
}