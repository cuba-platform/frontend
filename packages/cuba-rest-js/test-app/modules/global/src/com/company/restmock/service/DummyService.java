package com.company.restmock.service;


public interface DummyService {
    String NAME = "restmock_DummyService";

    void voidNoParams();

    void voidWithParams(String stringParam, int intParam);

}
