package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.MetaClass;
import com.haulmont.cuba.core.entity.EmbeddableEntity;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import java.util.Objects;

@MetaClass(name = "scr_CompositeAttribute")
@Embeddable
public class CompositeAttribute extends EmbeddableEntity {
    private static final long serialVersionUID = 1977718070249817133L;

    @Column(name = "FIRST_FIELD")
    private String first_field;

    @Column(name = "SECOND_FIELD")
    private String second_field;

    @Column(name = "THIRD_FIELD")
    private String third_field;

    @Override
    public int hashCode() {
        return Objects.hash(first_field, second_field, third_field);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompositeAttribute entity = (CompositeAttribute) o;
        return Objects.equals(this.first_field, entity.first_field) &&
                Objects.equals(this.second_field, entity.second_field) &&
                Objects.equals(this.third_field, entity.third_field);
    }

    public String getThird_field() {
        return third_field;
    }

    public void setThird_field(String third_field) {
        this.third_field = third_field;
    }

    public String getSecond_field() {
        return second_field;
    }

    public void setSecond_field(String second_field) {
        this.second_field = second_field;
    }

    public String getFirst_field() {
        return first_field;
    }

    public void setFirst_field(String first_field) {
        this.first_field = first_field;
    }
}
