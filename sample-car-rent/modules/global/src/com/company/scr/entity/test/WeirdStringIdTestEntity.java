package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.*;

import javax.persistence.Entity;
import javax.persistence.*;
import java.util.Date;

@NamePattern("%s|description")
@Table(name = "SCR_WEIRD_STRING_ID_TEST_ENTITY")
@Entity(name = "scr_WeirdStringIdTestEntity")
public class WeirdStringIdTestEntity extends BaseStringIdEntity implements Creatable, Updatable, SoftDelete, Versioned {
    private static final long serialVersionUID = 4322820552909829781L;

    @Id
    @Column(name = "IDENTIFIER", nullable = false, length = 10)
    private String identifier;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "ID")
    private String id;

    @Column(name = "CREATE_TS")
    private Date createTs;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Column(name = "UPDATE_TS")
    private Date updateTs;

    @Column(name = "UPDATED_BY", length = 50)
    private String updatedBy;

    @Column(name = "DELETE_TS")
    private Date deleteTs;

    @Column(name = "DELETED_BY", length = 50)
    private String deletedBy;

    @Version
    @Column(name = "VERSION", nullable = false)
    private Integer version;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATATYPES_TEST_ENTITY3_ID")
    private DatatypesTestEntity3 datatypesTestEntity3;

    public DatatypesTestEntity3 getDatatypesTestEntity3() {
        return datatypesTestEntity3;
    }

    public void setDatatypesTestEntity3(DatatypesTestEntity3 datatypesTestEntity3) {
        this.datatypesTestEntity3 = datatypesTestEntity3;
    }

    @Override
    public Integer getVersion() {
        return version;
    }

    @Override
    public void setVersion(Integer version) {
        this.version = version;
    }

    @Override
    public Boolean isDeleted() {
        return deleteTs != null;
    }

    @Override
    public String getDeletedBy() {
        return deletedBy;
    }

    @Override
    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }

    @Override
    public Date getDeleteTs() {
        return deleteTs;
    }

    @Override
    public void setDeleteTs(Date deleteTs) {
        this.deleteTs = deleteTs;
    }

    @Override
    public String getUpdatedBy() {
        return updatedBy;
    }

    @Override
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public Date getUpdateTs() {
        return updateTs;
    }

    @Override
    public void setUpdateTs(Date updateTs) {
        this.updateTs = updateTs;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreateTs() {
        return createTs;
    }

    public void setCreateTs(Date createTs) {
        this.createTs = createTs;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public void setId(String id) {
        this.identifier = id;
    }

    @Override
    public String getId() {
        return identifier;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
}