import React from 'react';
import {Collection} from "./Collection";
import renderer from 'react-test-renderer';
import * as cubaAppProvider from "../app/CubaAppProvider";

describe('Collection component', function () {

  it('Collection is rendered as null if there is no children', async () => {

    jest.spyOn(cubaAppProvider, 'getCubaREST').mockReturnValue({
        searchEntitiesWithCount: () => Promise.resolve({}),
        loadEntitiesWithCount: () => Promise.resolve({}),
      } as any);

    const collection = renderer.create(<Collection entityName="scr$Car" trackChanges={false} loadImmediately={false}/>);
    expect(collection.toJSON()).toBeNull();
  });

});
