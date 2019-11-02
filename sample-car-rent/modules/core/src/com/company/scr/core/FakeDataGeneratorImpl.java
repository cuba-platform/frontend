package com.company.scr.core;


import com.google.common.collect.ImmutableSet;
import com.haulmont.chile.core.model.MetaClass;
import com.haulmont.cuba.core.EntityManager;
import com.haulmont.cuba.core.Persistence;
import com.haulmont.cuba.core.Query;
import com.haulmont.cuba.core.entity.Creatable;
import com.haulmont.cuba.core.entity.Entity;
import com.haulmont.cuba.core.global.Metadata;
import com.haulmont.cuba.core.global.TimeSource;
import com.haulmont.cuba.core.global.UserSessionSource;
import com.haulmont.cuba.core.global.UuidSource;
import org.apache.commons.lang3.RandomStringUtils;

import org.apache.commons.lang3.RandomUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.*;


/**
 * @author minaev
 * @version $Id$
 */
@Component(value = FakeDataGenerator.NAME)
public class FakeDataGeneratorImpl implements FakeDataGenerator {

    public static final String GENERATOR_USER_NAME = "fakedatadenerator";
    private static final int MAX_STR_LENGTH = 7;
    @Inject
    private Persistence persistence;
    @Inject
    private Metadata metadata;
    @Inject
    private UuidSource uuidSource;
    @Inject
    private TimeSource timeSource;
    @Inject
    private UserSessionSource sessionSource;

    private Random rnd = new Random();

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void generate(MetaClass metaClass, int amount) {
        EntityManager em = persistence.getEntityManager();

        String realLogin = sessionSource.getUserSession().getUser().getLogin();
        //hack to specify specific createdBy
        sessionSource.getUserSession().getUser().setLogin(GENERATOR_USER_NAME);
        try {
            int i = 0;
            while (i < amount) {
                Entity entity = metadata.create(metaClass);
                fillEntityFields(entity);
                em.persist(entity);
                i++;
            }
        } finally {
            sessionSource.getUserSession().getUser().setLogin(realLogin);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void cleanup() {
        Collection<MetaClass> classes = metadata.getSession().getClasses();
        EntityManager em = persistence.getEntityManager();
        for (MetaClass metaClass : classes) {
            if (!metadata.getTools().isPersistent(metaClass) || !Creatable.class.isAssignableFrom(metaClass.getJavaClass())) {
                continue;
            }
            Query q = em.createQuery("delete from " + metaClass.getName() + " e where e.createdBy = :createdBy");
            q.setParameter("createdBy", GENERATOR_USER_NAME);
            q.executeUpdate();
        }
    }

    private void fillEntityFields(final Entity entity) {
        entity.getMetaClass().getProperties().forEach(p -> {
            String propName = p.getName();

            if (ImmutableSet.of("deleteTs", "deleteBy", "version").contains(propName))
                return;

            Class<?> javaType = p.getJavaType();

            if (UUID.class.equals(javaType)) {
                entity.setValue(propName, uuidSource.createUuid());
            } else if (p.getRange().isDatatype()) {
                if (String.class.equals(javaType)) {
                    int length = p.getAnnotations().get("length") != null ? (int) p.getAnnotations().get("length") : 6;
                    if (length > MAX_STR_LENGTH) {
                        length = MAX_STR_LENGTH;
                    }
                    entity.setValue(propName, RandomStringUtils.randomAlphanumeric(length));
                } else if (Date.class.equals(javaType)) {
                    entity.setValue(propName, timeSource.currentTimestamp());
                } else if (Boolean.class.equals(javaType)) {
                    entity.setValue(propName, RandomUtils.nextBoolean());
                }
            } else if (p.getRange().isEnum()) {
                List enumValues = p.getRange().asEnumeration().getValues();
                entity.setValue(propName, enumValues.get(rnd.nextInt(enumValues.size())));
            }
        });
    }

}
