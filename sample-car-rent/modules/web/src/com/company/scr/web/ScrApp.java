package com.company.scr.web;

import com.haulmont.cuba.web.DefaultApp;
import org.jetbrains.annotations.NotNull;

public class ScrApp extends DefaultApp {

    @Override @NotNull
    protected String routeTopLevelWindowId() {
        return "mainWindow";
    }

}
