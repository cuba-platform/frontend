package com.company.scr.entity.test;

import com.haulmont.cuba.core.entity.StandardEntity;
import com.haulmont.cuba.core.entity.annotation.EmbeddedParameters;

import javax.persistence.*;

@Table(name = "SCR_EMBEDDED_TEST_ENTITY")
@Entity(name = "scr_EmbeddedTestEntity")
public class EmbeddedTestEntity extends StandardEntity {
    private static final long serialVersionUID = -1705775673693231640L;

    @Column(name = "OWN_ATTRIBUTE")
    private String ownAttribute;

    @Embedded
    @EmbeddedParameters(nullAllowed = false)
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "EMBEDDED_NAME"))
    })
    private EmbeddedEntity embedded;

    public EmbeddedEntity getEmbedded() {
        return embedded;
    }

    public void setEmbedded(EmbeddedEntity embedded) {
        this.embedded = embedded;
    }

    public String getOwnAttribute() {
        return ownAttribute;
    }

    public void setOwnAttribute(String ownAttribute) {
        this.ownAttribute = ownAttribute;
    }
}