package com.company.scr.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import com.haulmont.cuba.core.entity.StandardEntity;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Table(name = "SCR_CAR_RENT")
@Entity(name = "scr$CarRent")
public class CarRent extends StandardEntity {
    private static final long serialVersionUID = 5091753883509056054L;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CAR_ID")
    protected Car car;

    @Temporal(TemporalType.DATE)
    @Column(name = "FROM_DATE")
    protected Date fromDate;

    @Temporal(TemporalType.TIME)
    @Column(name = "FROM_TIME")
    protected Date fromTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "FROM_DATE_TIME")
    protected Date fromDateTime;

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromTime(Date fromTime) {
        this.fromTime = fromTime;
    }

    public Date getFromTime() {
        return fromTime;
    }

    public void setFromDateTime(Date fromDateTime) {
        this.fromDateTime = fromDateTime;
    }

    public Date getFromDateTime() {
        return fromDateTime;
    }


    public void setCar(Car car) {
        this.car = car;
    }

    public Car getCar() {
        return car;
    }


}