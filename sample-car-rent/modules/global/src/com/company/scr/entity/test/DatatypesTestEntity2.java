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

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INT_IDENTITY_ID_TEST_ENTITY_ATTR_ID")
    private IntIdentityIdTestEntity intIdentityIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INTEGER_ID_TEST_ENTITY_ATTR_ID")
    private IntegerIdTestEntity integerIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STRING_ID_TEST_ENTITY_ATTR_IDENTIFIER")
    private StringIdTestEntity stringIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "WEIRD_STRING_ID_TEST_ENTITY_ATTR_IDENTIFIER")
    private WeirdStringIdTestEntity weirdStringIdTestEntityAttr;

    public WeirdStringIdTestEntity getWeirdStringIdTestEntityAttr() {
        return weirdStringIdTestEntityAttr;
    }

    public void setWeirdStringIdTestEntityAttr(WeirdStringIdTestEntity weirdStringIdTestEntityAttr) {
        this.weirdStringIdTestEntityAttr = weirdStringIdTestEntityAttr;
    }

    public StringIdTestEntity getStringIdTestEntityAttr() {
        return stringIdTestEntityAttr;
    }

    public void setStringIdTestEntityAttr(StringIdTestEntity stringIdTestEntityAttr) {
        this.stringIdTestEntityAttr = stringIdTestEntityAttr;
    }

    public IntegerIdTestEntity getIntegerIdTestEntityAttr() {
        return integerIdTestEntityAttr;
    }

    public void setIntegerIdTestEntityAttr(IntegerIdTestEntity integerIdTestEntityAttr) {
        this.integerIdTestEntityAttr = integerIdTestEntityAttr;
    }

    public IntIdentityIdTestEntity getIntIdentityIdTestEntityAttr() {
        return intIdentityIdTestEntityAttr;
    }

    public void setIntIdentityIdTestEntityAttr(IntIdentityIdTestEntity intIdentityIdTestEntityAttr) {
        this.intIdentityIdTestEntityAttr = intIdentityIdTestEntityAttr;
    }

    public DatatypesTestEntity getDatatypesTestEntityAttr() {
        return datatypesTestEntityAttr;
    }

    public void setDatatypesTestEntityAttr(DatatypesTestEntity datatypesTestEntityAttr) {
        this.datatypesTestEntityAttr = datatypesTestEntityAttr;
    }
}
