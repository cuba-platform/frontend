package com.company.restmock.service;

import org.springframework.stereotype.Service;

@Service(DummyService.NAME)
public class DummyServiceBean implements DummyService {

    @Override
    public void voidNoParams() {
    }

    @Override
    public void voidWithParams(String stringParam, int intParam) {
    }

}
