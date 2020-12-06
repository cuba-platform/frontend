import React from 'react';
import {Collection, fromRestModel} from "./Collection";
import renderer from 'react-test-renderer';
import * as cubaAppProvider from "../app/CubaAppProvider";

describe('Collection component', function () {

  it('Collection is rendered as null if there is no children', async () => {

    jest.spyOn(cubaAppProvider, 'getCubaREST').mockReturnValue({
        searchEntitiesWithCount: () => Promise.resolve({}),
        loadEntitiesWithCount: () => Promise.resolve({}),
      } as any);

    const c = renderer.create(<Collection entityName="scr$Car" trackChanges={false} loadImmediately={false}/>);
    expect(c.toJSON()).toBeNull();
  });

  it('fromRestModel applies transformation only if stringIdName is present', () => {
    const items = [
      { id: 'ID001', desc: 'Desc1', _instanceName: 'ID001 - Desc1'},
      { id: 'ID002', desc: 'Desc2', _instanceName: 'ID002 - Desc2'},
    ];
    const transformedItems = [
      { id: 'ID001', identifier: 'ID001', desc: 'Desc1', _instanceName: 'ID001 - Desc1'},
      { id: 'ID002', identifier: 'ID002', desc: 'Desc2', _instanceName: 'ID002 - Desc2'},
    ];

    expect(fromRestModel<any>(items)).toEqual(items);
    expect(fromRestModel<any>(items, 'identifier')).toEqual(transformedItems);
  });
});
