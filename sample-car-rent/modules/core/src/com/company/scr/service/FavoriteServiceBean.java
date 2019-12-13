package com.company.scr.service;

import com.company.scr.entity.Car;
import com.company.scr.entity.CarType;
import com.company.scr.entity.FavoriteCar;
import com.haulmont.cuba.core.global.DataManager;
import com.haulmont.cuba.core.global.LoadContext;
import com.haulmont.cuba.core.global.Metadata;
import com.haulmont.cuba.core.global.UserSessionSource;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service(FavoriteService.NAME)
public class FavoriteServiceBean implements FavoriteService {

    @Inject
    private DataManager dataManager;
    @Inject
    private Metadata metadata;
    @Inject
    private UserSessionSource sessionSource;

    @Override
    public void addFavorite(UUID carId, String notes) {
        Car car = dataManager.load(new LoadContext<>(Car.class).setId(carId));
        Objects.requireNonNull(car);

        _addFavorite(car, notes);
    }

    @Override
    public FavoriteCar addFavorite(Car car, String notes) {
        return _addFavorite(car, notes);
    }

    @Override
    public FavoriteCar addFavorite(FavInfo favInfo) {
        return _addFavorite(favInfo.getCar(), favInfo.getNotes());
    }

    @Override
    public List<FavoriteCar> getFavorites() {
        LoadContext<FavoriteCar> lc = new LoadContext<>(FavoriteCar.class).setView("favoriteCar-view");
        lc.setQueryString("select f from scr$FavoriteCar f where f.user.id = :uid");
        lc.getQuery().setParameter("uid", sessionSource.getUserSession().getUser().getId());
        return dataManager.loadList(lc);
    }

    @Override
    public List<FavoriteCar> getFavoritesByType(CarType carType) {
        LoadContext<FavoriteCar> lc = new LoadContext<>(FavoriteCar.class).setView("favoriteCar-view");
        lc.setQueryString("" +
                "select f from scr$FavoriteCar f " +
                "where " +
                "   f.user.id = :uid" +
                "   and f.car.carType = :carTypeId");
        lc.getQuery()
                .setParameter("uid", sessionSource.getUserSession().getUser().getId())
                .setParameter("carTypeId", carType.getId());
        return dataManager.loadList(lc);
    }

    private FavoriteCar _addFavorite(Car car, String notes) {
        FavoriteCar favoriteCar = metadata.create(FavoriteCar.class);

        favoriteCar.setCar(car);
        favoriteCar.setUser(sessionSource.getUserSession().getUser());
        favoriteCar.setNotes(notes);

        return dataManager.commit(favoriteCar);
    }
}