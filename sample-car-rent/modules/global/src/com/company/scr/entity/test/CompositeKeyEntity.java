package com.company.scr.entity.test;

import com.haulmont.cuba.core.entity.BaseGenericIdEntity;
import com.haulmont.cuba.core.entity.HasUuid;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.UUID;

@Table(name = "SCR_COMPOSITE_KEY_ENTITY")
@Entity(name = "scr_CompositeKeyEntity")
public class CompositeKeyEntity extends BaseGenericIdEntity<CompositeAttribute> implements HasUuid {
    private static final long serialVersionUID = 8248596526683267687L;

    @EmbeddedId
    private CompositeAttribute id;

    @Column(name = "TESTFLD")
    private String testfld;

    @Column(name = "UUID")
    private UUID uuid;

    public String getTestfld() {
        return testfld;
    }

    public void setTestfld(String testfld) {
        this.testfld = testfld;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    @Override
    public void setId(CompositeAttribute id) {
        this.id = id;
    }

    @Override
    public CompositeAttribute getId() {
        return id;
    }
}
