package com.company.scr.entity;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.FileDescriptor;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;
import com.haulmont.cuba.core.global.validation.groups.RestApiChecks;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Date;

@NamePattern("%s - %s|manufacturer,model")
@Table(name = "SCR_CAR")
@Entity(name = "scr$Car")

public class Car extends StandardEntity {
    private static final long serialVersionUID = 3318729131272219623L;

    @NotNull(message = "{msg://com.company.scr.entity/manufacturerEmpty}", groups = {RestApiChecks.class})
    @Column(name = "MANUFACTURER", nullable = false)
    protected String manufacturer;

    @Column(name = "MODEL")
    protected String model;

    @Size(min = 0, max = 5)
    @Column(name = "REG_NUMBER", length = 5)
    protected String regNumber;

    @Temporal(TemporalType.DATE)
    @Column(name = "PURCHASE_DATE")
    protected Date purchaseDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "MANUFACTURE_DATE")
    protected Date manufactureDate;

    @Column(name = "WHEEL_ON_RIGHT")
    protected Boolean wheelOnRight;

    @Column(name = "CAR_TYPE", nullable = false)
    protected String carType;

    @Column(name = "ECO_RANK")
    protected Integer ecoRank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GARAGE_ID")
    protected Garage garage;

    @Column(name = "MAX_PASSENGERS")
    protected Integer maxPassengers;

    @Column(name = "PRICE")
    protected BigDecimal price;

    @Column(name = "MILEAGE")
    protected Double mileage;

    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "")
    @JoinColumn(name = "TECHNICAL_CERTIFICATE_ID")
    protected TechnicalCertificate technicalCertificate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PHOTO_ID")
    protected FileDescriptor photo;

    public Date getManufactureDate() {
        return manufactureDate;
    }

    public void setManufactureDate(Date manufactureDate) {
        this.manufactureDate = manufactureDate;
    }

    public void setPhoto(FileDescriptor photo) {
        this.photo = photo;
    }

    public FileDescriptor getPhoto() {
        return photo;
    }


    public void setTechnicalCertificate(TechnicalCertificate technicalCertificate) {
        this.technicalCertificate = technicalCertificate;
    }

    public TechnicalCertificate getTechnicalCertificate() {
        return technicalCertificate;
    }


    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setMileage(Double mileage) {
        this.mileage = mileage;
    }

    public Double getMileage() {
        return mileage;
    }


    public void setModel(String model) {
        this.model = model;
    }

    public String getModel() {
        return model;
    }


    public void setMaxPassengers(Integer maxPassengers) {
        this.maxPassengers = maxPassengers;
    }

    public Integer getMaxPassengers() {
        return maxPassengers;
    }


    public void setGarage(Garage garage) {
        this.garage = garage;
    }

    public Garage getGarage() {
        return garage;
    }


    public void setEcoRank(EcoRank ecoRank) {
        this.ecoRank = ecoRank == null ? null : ecoRank.getId();
    }

    public EcoRank getEcoRank() {
        return ecoRank == null ? null : EcoRank.fromId(ecoRank);
    }


    public void setCarType(CarType carType) {
        this.carType = carType == null ? null : carType.getId();
    }

    public CarType getCarType() {
        return carType == null ? null : CarType.fromId(carType);
    }


    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }


    public void setRegNumber(String regNumber) {
        this.regNumber = regNumber;
    }

    public String getRegNumber() {
        return regNumber;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setWheelOnRight(Boolean wheelOnRight) {
        this.wheelOnRight = wheelOnRight;
    }

    public Boolean getWheelOnRight() {
        return wheelOnRight;
    }


}