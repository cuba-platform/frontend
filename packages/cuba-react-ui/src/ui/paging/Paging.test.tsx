import React from 'react';
import {addPagingParams, defaultPagingConfig, Paging, parsePagingParams} from "./Paging";
import renderer from 'react-test-renderer';

describe('Paging component', () => {

  it('Paging is rendered', async () => {
    let props = {
      paginationConfig: {...defaultPagingConfig},
      pageSize: 10,
      total: 50,
      onPagingChange: () => {}
    };

    const paging = renderer.create(<Paging {...props}/>);
    expect(paging.toJSON()!.children?.length).toBe(8);
  });

});

describe('paging params', () => {

  it('should return same url if one of param not set', () => {
    expect(addPagingParams('initialUrl', undefined, undefined)).toBe('initialUrl');
    expect(addPagingParams('initialUrl', undefined, 3)).toBe('initialUrl');
    expect(addPagingParams('initialUrl', 2, undefined)).toBe('initialUrl');
  });

  it('should parse null paging params', () => {
    expect(parsePagingParams('initialUrl', undefined, undefined))
      .toEqual({});
  });

});