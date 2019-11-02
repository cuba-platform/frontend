package com.company.scr.core;

import com.haulmont.chile.core.model.MetaClass;
import com.haulmont.cuba.core.global.Metadata;
import com.haulmont.cuba.security.app.Authenticated;
import org.springframework.stereotype.Component;

import javax.inject.Inject;

/**
 * @author minaev
 * @version $Id$
 */
@Component("FakeDataGeneratorMBean")
public class FakeDataGeneratorMBeanImpl implements FakeDataGeneratorMBean {

    @Inject
    private FakeDataGenerator fakeDataGenerator;
    @Inject
    private Metadata metadata;

    @Override
    @Authenticated
    public String generate(String entityName, int amount) {
        MetaClass metaClass = metadata.getSession().getClassNN(entityName);
        fakeDataGenerator.generate(metaClass, amount);
        return "Entities have been created";
    }

    @Override
    @Authenticated
    public String cleanup() {
        fakeDataGenerator.cleanup();
        return "Entities have been deleted";
    }
}
