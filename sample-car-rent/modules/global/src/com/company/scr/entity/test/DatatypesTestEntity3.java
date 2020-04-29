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

    @Column(name = "NAME")
    protected String name;

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