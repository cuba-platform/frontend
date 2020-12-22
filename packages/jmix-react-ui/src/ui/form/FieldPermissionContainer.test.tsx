import React from 'react';
import renderer from 'react-test-renderer';
import {FieldPermissionContainer} from "./FieldPermssionContainer";
import {Provider} from "mobx-react";

describe('FieldPermissionContainer', function () {

  it('FieldPermissionContainer is rendered as null if renderField is empty', async () => {
    const mainStore = {
      security: {
        getAttributePermission: () => {}
      }
    };

    const fpc = renderer.create((
      <Provider mainStore={mainStore}>
        <FieldPermissionContainer entityName="scr$Car" propertyName="engine" renderField={() => <></>}/>
      </Provider>
    ));
    expect(fpc.toJSON()).toBeNull();
  });

});