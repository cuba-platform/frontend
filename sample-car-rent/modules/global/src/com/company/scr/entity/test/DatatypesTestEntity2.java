package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.Composition;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;

import javax.persistence.*;

@Table(name = "SCR_DATATYPES_TEST_ENTITY2")
@Entity(name = "scr_DatatypesTestEntity2")
public class DatatypesTestEntity2 extends StandardEntity {
    private static final long serialVersionUID = -6208894674822064955L;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATATYPES_TEST_ENTITY_ATTR_ID")
    protected DatatypesTestEntity datatypesTestEntityAttr;

    public DatatypesTestEntity getDatatypesTestEntityAttr() {
        return datatypesTestEntityAttr;
    }

    public void setDatatypesTestEntityAttr(DatatypesTestEntity datatypesTestEntityAttr) {
        this.datatypesTestEntityAttr = datatypesTestEntityAttr;
    }
}
