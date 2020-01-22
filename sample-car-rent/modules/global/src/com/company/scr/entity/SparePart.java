package com.company.scr.entity;

import com.haulmont.chile.core.annotations.Composition;
import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.Lookup;
import com.haulmont.cuba.core.entity.annotation.LookupType;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;

import javax.persistence.*;
import java.time.*;
import java.util.List;
import java.util.UUID;

@NamePattern("%s|name")
@Table(name = "SCR_SPARE_PART")
@Entity(name = "scr$SparePart")
public class SparePart extends StandardEntity {
    private static final long serialVersionUID = -7787453227264087765L;

    @Column(name = "NAME")
    protected String name;

    @Lookup(type = LookupType.SCREEN, actions = {"lookup", "open", "clear"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SPARE_PARTS_ID")
    protected SparePart spareParts;

    @Column(name = "PART_ID")
    protected UUID partId;

    @Column(name = "CURRENT_STOCK")
    protected Long currentStock;

    @Column(name = "LOCAL_DATE")
    protected LocalDate localDate;

    @Column(name = "LOCAL_TIME")
    protected LocalTime localTime;

    @Column(name = "LOCAL_DATE_TIME")
    protected LocalDateTime localDateTime;

    @Column(name = "OFFSET_DATE_TIME")
    protected OffsetDateTime offsetDateTime;

    @Column(name = "OFFSET_TIME")
    protected OffsetTime offsetTime;

    @Column(name = "BYTE_ARRAY")
    protected byte[] byteArray;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COMPOSITION_O2O_ID")
    protected SparePartO2O compositionO2O;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "sparePart")
    protected List<SparePartO2M> compositionO2M;

    public List<SparePartO2M> getCompositionO2M() {
        return compositionO2M;
    }

    public void setCompositionO2M(List<SparePartO2M> compositionO2M) {
        this.compositionO2M = compositionO2M;
    }

    public SparePartO2O getCompositionO2O() {
        return compositionO2O;
    }

    public void setCompositionO2O(SparePartO2O compositionO2O) {
        this.compositionO2O = compositionO2O;
    }

    public byte[] getByteArray() {
        return byteArray;
    }

    public void setByteArray(byte[] byteArray) {
        this.byteArray = byteArray;
    }

    public OffsetTime getOffsetTime() {
        return offsetTime;
    }

    public void setOffsetTime(OffsetTime offsetTime) {
        this.offsetTime = offsetTime;
    }

    public OffsetDateTime getOffsetDateTime() {
        return offsetDateTime;
    }

    public void setOffsetDateTime(OffsetDateTime offsetDateTime) {
        this.offsetDateTime = offsetDateTime;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public void setLocalDateTime(LocalDateTime localDateTime) {
        this.localDateTime = localDateTime;
    }

    public LocalTime getLocalTime() {
        return localTime;
    }

    public void setLocalTime(LocalTime localTime) {
        this.localTime = localTime;
    }

    public LocalDate getLocalDate() {
        return localDate;
    }

    public void setLocalDate(LocalDate localDate) {
        this.localDate = localDate;
    }

    public Long getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Long currentStock) {
        this.currentStock = currentStock;
    }

    public UUID getPartId() {
        return partId;
    }

    public void setPartId(UUID partId) {
        this.partId = partId;
    }

    public SparePart getSpareParts() {
        return spareParts;
    }

    public void setSpareParts(SparePart spareParts) {
        this.spareParts = spareParts;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
