package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.Composition;
import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.OnDelete;
import com.haulmont.cuba.core.global.DeletePolicy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@NamePattern("%s|name")
@Table(name = "SCR_DATATYPES_TEST_ENTITY3")
@Entity(name = "scr_DatatypesTestEntity3")
public class DatatypesTestEntity3 extends StandardEntity {
    private static final long serialVersionUID = -7419613295006724108L;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "datatypesTestEntity3")
    protected List<DatatypesTestEntity> datatypesTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "datatypesTestEntity3")
    private List<IntegerIdTestEntity> integerIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "datatypesTestEntity3")
    private List<IntIdentityIdTestEntity> intIdentityIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "datatypesTestEntity3")
    private List<StringIdTestEntity> stringIdTestEntityAttr;

    @Composition
    @OnDelete(DeletePolicy.CASCADE)
    @OneToMany(mappedBy = "datatypesTestEntity3")
    private List<WeirdStringIdTestEntity> weirdStringIdTestEntityAttr;

    @Column(name = "NAME")
    protected String name;

    public List<WeirdStringIdTestEntity> getWeirdStringIdTestEntityAttr() {
        return weirdStringIdTestEntityAttr;
    }

    public void setWeirdStringIdTestEntityAttr(List<WeirdStringIdTestEntity> weirdStringIdTestEntityAttr) {
        this.weirdStringIdTestEntityAttr = weirdStringIdTestEntityAttr;
    }

    public List<StringIdTestEntity> getStringIdTestEntityAttr() {
        return stringIdTestEntityAttr;
    }

    public void setStringIdTestEntityAttr(List<StringIdTestEntity> stringIdTestEntityAttr) {
        this.stringIdTestEntityAttr = stringIdTestEntityAttr;
    }

    public List<IntIdentityIdTestEntity> getIntIdentityIdTestEntityAttr() {
        return intIdentityIdTestEntityAttr;
    }

    public void setIntIdentityIdTestEntityAttr(List<IntIdentityIdTestEntity> intIdentityIdTestEntityAttr) {
        this.intIdentityIdTestEntityAttr = intIdentityIdTestEntityAttr;
    }

    public List<IntegerIdTestEntity> getIntegerIdTestEntityAttr() {
        return integerIdTestEntityAttr;
    }

    public void setIntegerIdTestEntityAttr(List<IntegerIdTestEntity> integerIdTestEntityAttr) {
        this.integerIdTestEntityAttr = integerIdTestEntityAttr;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<DatatypesTestEntity> getDatatypesTestEntityAttr() {
        return datatypesTestEntityAttr;
    }

    public void setDatatypesTestEntityAttr(List<DatatypesTestEntity> datatypesTestEntityAttr) {
        this.datatypesTestEntityAttr = datatypesTestEntityAttr;
    }
}