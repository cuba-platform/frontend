import {PaginationConfig} from "antd/lib/table";
import {DataCollectionStore} from "@cuba-platform/react-core";
import * as QueryString from "querystring";
import React from "react";
import {Pagination} from "antd";
import {toJS} from "mobx";

type Props = {
  paginationConfig: PaginationConfig;
  total?: number,
  onPagingChange: (current: number, pageSize?: number) => void;
}

/**
 * Paging defaults
 */
export const defaultPagingConfig: PaginationConfig = {
  current: 1,
  pageSize: 10,
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['20', '50', '100', '500', '1000', '5000']
};

/**
 * Ant Design Pagination component adopted to our List and DataCollectionStore
 */
export class Paging extends React.Component<Props> {

  render() {
    const {paginationConfig, total} = this.props;

    return (
      <Pagination
        {...paginationConfig}
        total={total}
        pageSizeOptions={toJS(paginationConfig.pageSizeOptions)}
        onChange={this.props.onPagingChange}
        onShowSizeChange={this.props.onPagingChange}
      />
    );
  }
}

/**
 * Returns new PaginationConfig object with 'current' and 'pageSize' params, parsed from location.search.
 * If param not found in search url, previous value (currentPrev, pageSizePrev) will be returned.
 *
 * @param locationSearch trying to find paging params here
 * @param currentPrev - previous value, will be returned in result if new value not found in locationSeach
 * @param pageSizePrev - previous value, will be returned in result if new value not found in locationSeach
 */
export function parsePagingParams(locationSearch: string, currentPrev: number | undefined, pageSizePrev: number | undefined): PaginationConfig {
  // remove '?' from start of location.search
  const locationSearchParams = locationSearch && locationSearch.length > 0 ? locationSearch.substr(1) : '';
  // parse params
  const parsedUrlQuery = QueryString.parse(locationSearchParams);
  const current = typeof parsedUrlQuery.page == 'string' ? parseInt(parsedUrlQuery.page) : currentPrev;
  const pageSize = typeof parsedUrlQuery.pageSize == 'string' ? parseInt(parsedUrlQuery.pageSize) : pageSizePrev;

  return {current, pageSize};
}

/**
 * Add paging params at the end of url string.
 * Returns url with
 * Note - expects that url has no params, so this method add '?' before params.
 *
 * @param url - params will be added to this url
 * @param current - current page
 * @param pageSize - page size
 */
export function addPagingParams(url: string, current: number | undefined, pageSize: number | undefined): string {
  if (!current || !pageSize) return url;
  return `${url}?page=${current}&pageSize=${pageSize}`;
}

/**
 * Apply paginationConfig to collectionDataStore, reload dataStore if required
 *
 * @param pagination - PaginationConfig
 * @param dataCollection -page size and current page will be set to this collection data store
 * @param reload - reload collection data store, if needsr
 */
export function setPagination<E>(pagination: PaginationConfig, dataCollection: DataCollectionStore<E>, reload: boolean = false) {

  const {disabled, pageSize, current} = pagination;

  if (disabled === true) {
    dataCollection.limit = undefined;
    dataCollection.offset = undefined;
    dataCollection.skipCount = true;
    if (reload) dataCollection.load();
    return;
  }

  // need to sync enabled pagination config and dataCollection - reset limit and offset
  if (dataCollection.skipCount) {
    dataCollection.skipCount = false;
  }

  if (pageSize && current) {
    dataCollection.limit = pageSize;
    dataCollection.offset = pageSize * (current - 1);
  }

  if (reload) dataCollection.load();
}


/**
 * @param urlParams query params from 'location.history'
 * @param disabled set to true, if no pagination required for component
 */
export function createPagingConfig(urlParams: string, disabled: boolean = false) {
  const config = {...defaultPagingConfig};
  if (disabled) {
    return {config, disabled: true};
  }

  const {current, pageSize} = config;
  return {...config, ...parsePagingParams(urlParams, current, pageSize)};
}