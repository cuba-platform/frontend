package com.company.scr.core;

import com.haulmont.chile.core.model.MetaClass;

/**
 * @author minaev
 * @version $Id$
 */
public interface FakeDataGenerator {

    String NAME = "FakeDataGenerator";

    void generate(MetaClass metaClass, int amount);

    void cleanup();

}
