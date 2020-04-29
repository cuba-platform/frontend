package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.Composition;
import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;

import javax.persistence.*;

@NamePattern("%s|name")
@Table(name = "SCR_COMPOSITION_O2O_TEST_ENTITY")
@Entity(name = "scr_CompositionO2OTestEntity")
public class CompositionO2OTestEntity extends StandardEntity {
    private static final long serialVersionUID = -3212555290356930151L;

    @Column(name = "NAME")
    protected String name;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NESTED_COMPOSITION_ID")
    protected DeeplyNestedTestEntity nestedComposition;

    public DeeplyNestedTestEntity getNestedComposition() {
        return nestedComposition;
    }

    public void setNestedComposition(DeeplyNestedTestEntity nestedComposition) {
        this.nestedComposition = nestedComposition;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
