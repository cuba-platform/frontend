package com.company.scr.entity;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.chile.core.annotations.NamePattern;

@NamePattern("%s|certNumber")
@Table(name = "SCR_TECHNICAL_CERTIFICATE")
@Entity(name = "scr$TechnicalCertificate")
public class TechnicalCertificate extends StandardEntity {
    private static final long serialVersionUID = -75607612085413570L;

    @Column(name = "CERT_NUMBER")
    protected String certNumber;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "technicalCertificate")
    protected Car car;

    public void setCertNumber(String certNumber) {
        this.certNumber = certNumber;
    }

    public String getCertNumber() {
        return certNumber;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    public Car getCar() {
        return car;
    }


}