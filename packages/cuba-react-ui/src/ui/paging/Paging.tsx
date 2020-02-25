import {PaginationConfig} from "antd/es/table";
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
  pageSize: 3,
  defaultPageSize: 3,
  showSizeChanger: true,
  pageSizeOptions: ['2', '3', '4']
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
  if (pagination && pagination.pageSize && pagination.current) {
    dataCollection.limit = pagination.pageSize;
    dataCollection.offset = pagination.pageSize * (pagination.current - 1);
    if (reload) dataCollection.load();
  }
}