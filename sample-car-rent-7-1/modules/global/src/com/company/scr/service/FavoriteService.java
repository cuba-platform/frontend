package com.company.scr.service;


import com.company.scr.entity.Car;
import com.company.scr.entity.CarType;
import com.company.scr.entity.FavoriteCar;

import java.util.List;
import java.util.UUID;

public interface FavoriteService {

    String NAME = "scr_FavoriteService";

    void addFavorite(UUID carId, String notes);

    FavoriteCar addFavorite(Car car, String notes);

    FavoriteCar addFavorite(FavInfo favInfo);

    List<FavoriteCar> getFavorites();

    List<FavoriteCar> getFavoritesByType(CarType carType);

    void refreshCache();

    class FavInfo {

        private Car car;
        private String notes;

        public Car getCar() {
            return car;
        }

        public void setCar(Car car) {
            this.car = car;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}