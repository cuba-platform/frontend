import React from 'react';
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig,
  Paging,
  parsePagingParams,
  setPagination
} from "./Paging";
import renderer from 'react-test-renderer';
import {PaginationConfig} from "antd/lib/pagination";

describe('Paging component', () => {

  it('Paging is rendered', async () => {
    let props = {
      paginationConfig: {...defaultPagingConfig},
      pageSize: 10,
      total: 50,
      onPagingChange: () => {}
    };

    const items = renderer.create(<Paging {...props}/>).root
      .findAll(el => el.props.className?.indexOf('ant-pagination-item ant-pagination-item-') === 0);
    expect(items?.length).toBe(5);
  });
});

describe('addPagingParams', () => {

  it('should return same url if one of param not set', () => {
    expect(addPagingParams('initialUrl', undefined, undefined)).toBe('initialUrl');
    expect(addPagingParams('initialUrl', undefined, 3)).toBe('initialUrl');
    expect(addPagingParams('initialUrl', 2, undefined)).toBe('initialUrl');
  });

  it('should add paging params to url', () => {
    expect(addPagingParams('initialUrl', 2, 4)).toBe('initialUrl?page=2&pageSize=4');
  });
});

describe('parsePagingParams', () => {
  it('should parse null paging params', () => {
    expect(parsePagingParams('initialUrl', undefined, undefined))
      .toEqual({});
    expect(parsePagingParams('', undefined, undefined))
      .toEqual({});
  });

  it('should parse paging params', () => {
    expect(parsePagingParams('?page=4&pageSize=7', undefined, undefined))
      .toEqual({current: 4, pageSize: 7});
    expect(parsePagingParams('?page=3', 10, 20))
      .toEqual({current: 3, pageSize: 20});
    expect(parsePagingParams('?pageSize=8', 10, 20))
      .toEqual({current: 10, pageSize: 8});

    expect(parsePagingParams('?page=&pageSize=', 7, 18))
      .toEqual({current: 7, pageSize: 18});
    expect(parsePagingParams('?page=AAAAA&pageSize=BBBBBB', 7, 18))
      .toEqual({current: 7, pageSize: 18});
    expect(parsePagingParams('?page=null&pageSize=undefined', 7, 18))
      .toEqual({current: 7, pageSize: 18});
  });

  it ('should parse paging params without question mark at start', () => {
    expect(parsePagingParams('page=4&pageSize=7', undefined, undefined))
      .toEqual({current: 4, pageSize: 7});
  })
});

const pagingConfig: PaginationConfig = {
  current: 5,
  pageSize: 10
};

describe('setPagination', () => {

  it('should set pagination to dataCollection', () => {
    let ds = {offset: 0, limit: 0, load: jest.fn()} as any;
    setPagination(pagingConfig, ds);
    expect(ds).toMatchObject({offset: 40, limit: 10});
    expect(ds.load).not.toBeCalled();

    ds = {offset: 0, limit: 0, load: jest.fn()} as any;
    setPagination({}, ds);
    expect(ds).toMatchObject({offset: 0, limit: 0});
    expect(ds.load).not.toBeCalled();
  });

  it('should set pagination to dataCollection and reload', () => {
    const ds = {offset: 0, limit: 0} as any;
    ds.load = jest.fn();
    setPagination(pagingConfig, ds, true);
    expect(ds).toMatchObject({offset: 40, limit: 10});
    expect(ds.load).toBeCalled();

    ds.load = jest.fn();
    const config = {...pagingConfig, disabled: true};
    setPagination(config, ds, true);
    expect(ds).toMatchObject({offset: undefined, limit: undefined});
    expect(ds.load).toBeCalled();

    ds.load = jest.fn();
    setPagination(config, ds);
    expect(ds).toMatchObject({offset: undefined, limit: undefined});
    expect(ds.load).not.toBeCalled();
  });

});

describe('createPagingConfig', () => {

  it('should create disabled paging config', () => {
    expect(createPagingConfig('', true).disabled).toBeTruthy();
  });

  it('should create enabled paging config', () => {
    expect(createPagingConfig(''))
      .toMatchObject(defaultPagingConfig);
  });

  it('should check that page size is used only if it\'s value in pageSizeOptions', () => {
    expect(createPagingConfig('?page=4&pageSize=7'))
      .toMatchObject(defaultPagingConfig);

    expect(createPagingConfig('?page=4&pageSize=10'))
      .toMatchObject({...defaultPagingConfig, current: 4, pageSize: 10});

    const config = {...defaultPagingConfig, pageSizeOptions: ['7']};
    expect(createPagingConfig('?page=4&pageSize=7', false, config))
      .toMatchObject({...config, current: 4, pageSize: 7});
  });

});
