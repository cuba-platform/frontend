package com.company.scr.entity.test;

import com.haulmont.cuba.core.entity.BaseGenericIdEntity;
import com.haulmont.cuba.core.entity.HasUuid;
import com.haulmont.cuba.core.entity.StandardEntity;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.UUID;

@Table(name = "SCR_COMPOSITE_KEY_TEST_ENTITY")
@Entity(name = "scr_CompositeKeyTestEntity")
public class CompositeKeyTestEntity extends BaseGenericIdEntity<CompositeKeyTestEntityPK> implements HasUuid {
    private static final long serialVersionUID = 8321831195187107791L;
    @EmbeddedId
    private CompositeKeyTestEntityPK id;
    @Column(name = "UUID")
    private UUID uuid;

    @Column(name = "DESCRIPTION")
    private String description;

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    @Override
    public void setId(CompositeKeyTestEntityPK id) {
        this.id = id;
    }

    @Override
    public CompositeKeyTestEntityPK getId() {
        return id;
    }
}