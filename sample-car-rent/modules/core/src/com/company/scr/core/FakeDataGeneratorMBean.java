package com.company.scr.core;

import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;

/**
 * @author minaev
 * @version $Id$
 */
@ManagedResource(description = "Generates fake data")
public interface FakeDataGeneratorMBean {

    @ManagedOperation
    String generate(String entityName, int amount);

    @ManagedOperation
    String cleanup();

}
