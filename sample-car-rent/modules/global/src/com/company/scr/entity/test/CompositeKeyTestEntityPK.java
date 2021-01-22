package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.MetaClass;
import com.haulmont.cuba.core.entity.EmbeddableEntity;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import java.util.Objects;

@MetaClass(name = "scr_CompositeKeyTestEntityPK")
@Embeddable
public class CompositeKeyTestEntityPK extends EmbeddableEntity {
    private static final long serialVersionUID = -1888679234365651271L;

    @Column
    private Long code;
    @Column
    private Long name;

    @Override
    public int hashCode() {
        return Objects.hash(code, name);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompositeKeyTestEntityPK entity = (CompositeKeyTestEntityPK) o;
        return Objects.equals(this.code, entity.code) &&
                Objects.equals(this.name, entity.name);
    }

    public Long getCode() {
        return code;
    }

    public void setCode(Long code) {
        this.code = code;
    }

    public Long getName() {
        return name;
    }

    public void setName(Long name) {
        this.name = name;
    }
}