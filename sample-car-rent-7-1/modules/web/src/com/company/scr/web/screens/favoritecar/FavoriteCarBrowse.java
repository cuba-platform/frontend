package com.company.scr.web.screens.favoritecar;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.FavoriteCar;

@UiController("scr$FavoriteCar.browse")
@UiDescriptor("favorite-car-browse.xml")
@LookupComponent("favoriteCarsTable")
@LoadDataBeforeShow
public class FavoriteCarBrowse extends StandardLookup<FavoriteCar> {
}