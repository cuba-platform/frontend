package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.*;

import javax.persistence.Entity;
import javax.persistence.*;
import java.util.Date;

@NamePattern("%s|description")
@Table(name = "SCR_INT_IDENTITY_ID_TEST_ENTITY")
@Entity(name = "scr_IntIdentityIdTestEntity")
public class IntIdentityIdTestEntity extends BaseIntIdentityIdEntity implements Updatable, SoftDelete, Creatable, Versioned {

    private static final long serialVersionUID = -2950453447341084441L;


    @Column(name = "DESCRIPTION")
    protected String description;

    @Column(name = "UPDATE_TS")
    protected Date updateTs;

    @Column(name = "UPDATED_BY", length = 50)
    protected String updatedBy;

    @Column(name = "DELETE_TS")
    protected Date deleteTs;

    @Column(name = "DELETED_BY", length = 50)
    protected String deletedBy;

    @Column(name = "CREATE_TS")
    private Date createTs;

    @Column(name = "CREATED_BY", length = 50)
    private String createdBy;

    @Version
    @Column(name = "VERSION", nullable = false)
    private Integer version;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DATATYPES_TEST_ENTITY3_ID")
    private DatatypesTestEntity3 datatypesTestEntity3;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "intIdentityIdTestEntityAssociationO2OAttr")
    private DatatypesTestEntity datatypesTestEntity;

    public DatatypesTestEntity getDatatypesTestEntity() {
        return datatypesTestEntity;
    }

    public void setDatatypesTestEntity(DatatypesTestEntity datatypesTestEntity) {
        this.datatypesTestEntity = datatypesTestEntity;
    }

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
    public String getCreatedBy() {
        return createdBy;
    }

    @Override
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public Date getCreateTs() {
        return createTs;
    }

    @Override
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
    public Boolean isDeleted() {
        return deleteTs != null;
    }

    @Override
    public Date getUpdateTs() {
        return updateTs;
    }

    @Override
    public void setUpdateTs(Date updateTs) {
        this.updateTs = updateTs;
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
    public Date getDeleteTs() {
        return deleteTs;
    }

    @Override
    public void setDeleteTs(Date deleteTs) {
        this.deleteTs = deleteTs;
    }

    @Override
    public String getDeletedBy() {
        return deletedBy;
    }

    @Override
    public void setDeletedBy(String deletedBy) {
        this.deletedBy = deletedBy;
    }
}