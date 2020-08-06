package com.company.scr.entity;

import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.*;

@Table(name = "SCR_PROMO_CODE")
@Entity(name = "scr_PromoCode")
public class PromoCode extends StandardEntity {
    private static final long serialVersionUID = -1L;

    @Column(name = "DISCOUNT")
    private java.lang.Double discount;

    @Temporal(TemporalType.DATE)
    @Column(name = "VALID_THROUGH")
    private java.util.Date validThrough;

    public java.util.Date getValidThrough() {
        return validThrough;
    }

    public void setValidThrough(java.util.Date validThrough) {
        this.validThrough = validThrough;
    }

    public java.lang.Double getDiscount() {
        return discount;
    }

    public void setDiscount(java.lang.Double discount) {
        this.discount = discount;
    }
}