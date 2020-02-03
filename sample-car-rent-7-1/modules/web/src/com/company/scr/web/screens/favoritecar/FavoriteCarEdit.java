package com.company.scr.web.screens.favoritecar;

import com.haulmont.cuba.gui.screen.*;
import com.company.scr.entity.FavoriteCar;

@UiController("scr$FavoriteCar.edit")
@UiDescriptor("favorite-car-edit.xml")
@EditedEntityContainer("favoriteCarDc")
@LoadDataBeforeShow
public class FavoriteCarEdit extends StandardEditor<FavoriteCar> {
}