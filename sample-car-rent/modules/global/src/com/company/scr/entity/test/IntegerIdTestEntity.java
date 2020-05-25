package com.company.scr.entity.test;

import com.haulmont.chile.core.annotations.NamePattern;
import com.haulmont.cuba.core.entity.*;

import javax.persistence.Entity;
import javax.persistence.*;
import java.util.Date;
import java.util.List;

@NamePattern("%s|description")
@Table(name = "SCR_INTEGER_ID_TEST_ENTITY")
@Entity(name = "scr_IntegerIdTestEntity")
public class IntegerIdTestEntity extends BaseIntegerIdEntity implements Creatable, Updatable, SoftDelete, Versioned {
    private static final long serialVersionUID = 8847401225837049972L;

    @Column(name = "DESCRIPTION")
    private String description;

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
    @JoinTable(name = "SCR_DATATYPES_TEST_ENTITY_INTEGER_ID_TEST_ENTITY_LINK",
            joinColumns = @JoinColumn(name = "INTEGER_ID_TEST_ENTITY_ID"),
            inverseJoinColumns = @JoinColumn(name = "DATATYPES_TEST_ENTITY_ID"))
    @ManyToMany
    private List<DatatypesTestEntity> datatypesTestEntities;

    public List<DatatypesTestEntity> getDatatypesTestEntities() {
        return datatypesTestEntities;
    }

    public void setDatatypesTestEntities(List<DatatypesTestEntity> datatypesTestEntities) {
        this.datatypesTestEntities = datatypesTestEntities;
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

}