import {ColumnFilterItem, ColumnProps, FilterDropdownProps, PaginationConfig, SorterResult} from 'antd/es/table';
import React from 'react';
import {getPropertyCaption, getPropertyInfoNN} from '../../util/metadata';
import { MainStore } from '../../app/MainStore';
import {Condition, ConditionsGroup, EntityFilter, EnumInfo, EnumValueInfo, MetaPropertyInfo} from '@cuba-platform/rest';
import {DataTableCell} from './DataTableCell';
import {
  ComparisonType,
  DataTableCustomFilter as CustomFilter,
  DataTableCustomFilterProps
} from './DataTableCustomFilter';
import {DataCollectionStore} from '../..';
import { toJS } from 'mobx';

/**
 * `filters` is an object received in antd `Table`'s `onChange` callback, it is a mapping between column names and currently applied filters.
 *
 * `operator` and `value` are lifted up from the custom filter component in order to allow operations on all filters at once,
 * such as clearing all filters.
 *
 * `customFilterRef` provides access to custom filter's `Form`, which can be used e.g. to clear the forms when clearing all filters.
 */
export interface DataColumnConfig {
  propertyName: string,
  entityName: string,
  enableFilter: boolean,
  filters: Record<string, any> | undefined,
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  value: any,
  onValueChange: (value: any, propertyName: string) => void,
  enableSorter: boolean,
  mainStore: MainStore,
  customFilterRef?: (instance: React.Component<DataTableCustomFilterProps>) => void
}

/**
 * @remarks
 * It is possible to create a vanilla antd `Table` and customize some of its columns
 * with `DataTable`'s custom filters using this helper function.
 *
 * @param config
 *
 * @example
 * ```typescript jsx
 *  import * as React from "react";
 *  import {action, observable} from 'mobx';
 *  import {observer} from "mobx-react";
 *  import {Table,} from "antd";
 *  import {Car} from "../../cuba/entities/mpg$Car";
 *  import {
 *   collection, injectMainStore, MainStoreInjected,
 *   generateDataColumn, ComparisonType, handleTableChange,
 * } from "@cuba-platform/react";
 *  import {injectIntl, WrappedComponentProps} from 'react-intl';
 *  import {PaginationConfig} from 'antd/es/pagination';
 *  import { SorterResult } from "antd/es/table";
 *
 *  @injectMainStore
 *  @observer
 *  class CarTableComponent extends React.Component<MainStoreInjected & WrappedComponentProps> {
 *
 *   dataCollection = collection<Car>(Car.NAME, {view: 'car-edit', sort: '-updateTs'});
 *
 *   fields = ['purchaseDate','price','regNumber'];
 *
 *   @observable.ref filters: Record<string, string[]> | undefined;
 *   @observable operator: ComparisonType | undefined;
 *   @observable value: any;
 *
 *   @action
 *   handleOperatorChange = (operator: ComparisonType) => this.operator = operator;
 *
 *   @action
 *   handleValueChange = (value: any) => this.value = value;
 *
 *   @action
 *   handleChange = (pagination: PaginationConfig, tableFilters: Record<string, string[]>, sorter: SorterResult<Car>): void => {
 *     this.filters = tableFilters;
 *
 *     handleTableChange({
 *       pagination: pagination,
 *       filters: tableFilters,
 *       sorter: sorter,
 *       defaultSort: '-updateTs',
 *       fields: this.fields,
 *       mainStore: this.props.mainStore!,
 *       dataCollection: this.dataCollection
 *     });
 *   };
 *
 *   render() {
 *
 *     return (
 *       <Table
 *         dataSource={this.dataCollection.items.slice()}
 *         columns={[
 *           { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate', render: (text: any) => <b>{text}</b> },
 *           { title: 'Price', dataIndex: 'price', key: 'price' },
 *           generateDataColumn({
 *             propertyName: 'regNumber',
 *             entityName: this.dataCollection.entityName,
 *             filters: this.filters,
 *             operator: this.operator,
 *             onOperatorChange: this.handleOperatorChange,
 *             value: this.value,
 *             onValueChange: this.handleValueChange,
 *             enableSorter: true,
 *             mainStore: this.props.mainStore!
 *           })
 *         ]}
 *         onChange={this.handleChange}
 *         pagination={{
 *           showSizeChanger: true,
 *           total: this.dataCollection.count,
 *         }}
 *       />
 *     );
 *   }
 *
 * }
 *
 *  const CarTable = injectIntl(CarTableComponent);
 *
 *  export default CarTable;
 *  ```
 */
export function generateDataColumn<EntityType>(config: DataColumnConfig): ColumnProps<EntityType> {
  const {
    propertyName,
    entityName,
    enableFilter,
    filters,
    operator,
    onOperatorChange,
    value,
    onValueChange,
    enableSorter,
    mainStore,
    customFilterRef
  } = config;

  let dataIndex: string;
  const propertyInfo = getPropertyInfoNN(propertyName as string, entityName, mainStore!.metadata!);

  switch(propertyInfo.attributeType) {
    case 'COMPOSITION':
    case 'ASSOCIATION':
      dataIndex = `${propertyName}._instanceName`;
      break;
    default:
      dataIndex = propertyName as string;
  }

  const localizedPropertyCaption = getPropertyCaption(propertyName as string, entityName, mainStore!.messages!);

  let defaultColumnProps: ColumnProps<EntityType> = {
    title: (
      <div
        className='cuba-data-table-header-cell'
        title={localizedPropertyCaption}>
          {localizedPropertyCaption}
        </div>
      ),
    dataIndex,
    sorter: enableSorter,
    key: propertyName as string,
    render: text => renderCell(propertyInfo, text, mainStore)
  };

  if (enableFilter) {
    defaultColumnProps = {
      ...defaultColumnProps,
      // According to the typings this field expects any[] | undefined
      // However, in reality undefined makes the filter icon to be highlighted.
      // If we want the icon to not be highlighted we need to pass null instead.
      // @ts-ignore
      filteredValue: (filters && filters[propertyName])
        ? toJS(filters[propertyName])
        : null,
    };

    if (propertyInfo.attributeType === 'ENUM') {
      defaultColumnProps = {
        filters: generateEnumFilter(propertyInfo, mainStore),
        ...defaultColumnProps
      };
    } else {
      defaultColumnProps = {
        filterDropdown: generateCustomFilterDropdown(
          propertyName as string,
          entityName,
          operator,
          onOperatorChange,
          value,
          onValueChange,
          customFilterRef,
        ),
        ...defaultColumnProps
      };
    }
  }

  return defaultColumnProps;
}

/**
 * Generates a standard antd table column filter for enum fields.
 *
 * @param propertyInfo
 * @param mainStore
 */
export function generateEnumFilter(propertyInfo: MetaPropertyInfo, mainStore: MainStore): ColumnFilterItem[] {
  const propertyEnumInfo: EnumInfo | undefined = mainStore!.enums!
    .find((enumInfo: EnumInfo) => {
      return enumInfo.name === propertyInfo.type;
    });

  if (!propertyEnumInfo) {
    return [];
  }

  return propertyEnumInfo.values.map((enumValueInfo: EnumValueInfo) => {
    return {
      text: enumValueInfo.caption,
      value: enumValueInfo.name
    };
  });
}

/**
 *
 * @param propertyName
 * @param entityName
 * @param operator
 * @param onOperatorChange
 * @param value
 * @param onValueChange
 * @param customFilterRefCallback
 */
export function generateCustomFilterDropdown(
  propertyName: string,
  entityName: string,
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  value: any,
  onValueChange: (value: any, propertyName: string) => void,
  customFilterRefCallback?: (instance: React.Component<DataTableCustomFilterProps>) => void,
): ((props: FilterDropdownProps) => React.ReactNode) {
  return (props: FilterDropdownProps) => {
    return (
      <CustomFilter entityName={entityName}
                    entityProperty={propertyName}
                    filterProps={props}
                    operator={operator}
                    onOperatorChange={onOperatorChange}
                    value={value}
                    onValueChange={onValueChange}
                    ref={customFilterRefCallback}
      />
    );
  }
}

/**
 * Generates a table cell that can be different depending on property type. See `DataTableCell` for details.
 *
 * @param propertyInfo
 * @param text
 * @param mainStore
 */
export function renderCell(propertyInfo: MetaPropertyInfo, text: any, mainStore: MainStore) {
  return DataTableCell({
    text,
    propertyInfo,
    mainStore
  });
}

/**
 * Sets filters on provided `dataCollection` based on current state of table filters
 *
 * @param tableFilters
 * @param fields
 * @param mainStore
 * @param dataCollection
 */
export function setFilters<E>(
  tableFilters: Record<string, string[]>,
  fields: string[],
  mainStore: MainStore,
  dataCollection: DataCollectionStore<E>,
) {
  let entityFilter: EntityFilter | undefined = undefined;

  if (dataCollection.filter && dataCollection.filter.conditions && dataCollection.filter.conditions.length > 0) {
    const preservedConditions: Array<Condition | ConditionsGroup> = dataCollection.filter.conditions.filter(condition => {
      return isPreservedCondition(condition, fields);
    });

    if (preservedConditions.length > 0) {
      entityFilter = {
        conditions: preservedConditions
      };
    }
  }

  if (tableFilters) {
    fields.forEach((propertyName: string) => {
      if (tableFilters.hasOwnProperty(propertyName) && tableFilters[propertyName] && tableFilters[propertyName].length > 0) {
        if (!entityFilter) {
          entityFilter = {
            conditions: []
          };
        }

        if (getPropertyInfoNN(
          propertyName as string, dataCollection.entityName, mainStore.metadata!
        ).attributeType === 'ENUM') {
          // @ts-ignore // TODO fix cuba-react typing
          entityFilter.conditions.push({
            property: propertyName,
            operator: 'in',
            value: tableFilters[propertyName],
          });
        } else {
          const {operator, value} = JSON.parse(tableFilters[propertyName][0]);
          if (operator === 'inInterval') {
            const {minDate, maxDate} = value;
            entityFilter.conditions.push({
              property: propertyName,
              operator: '>=',
              value: minDate,
            });
            entityFilter.conditions.push({
              property: propertyName,
              operator: '<=',
              value: maxDate,
            });
          } else {
            entityFilter.conditions.push({
              property: propertyName,
              operator,
              value,
            });
          }
        }
      }
    });
  }

  dataCollection.filter = entityFilter;
}

/**
 * Sets sort field/order on provided `dataCollection` based on current state of table `sorter`
 *
 * @param sorter
 * @param defaultSort name of the field to be sorted by. If the name is preceeding by the '+' character, then the sort order is ascending,
 * if by the '-' character then descending. If there is no special character before the property name, then ascending sort will be used.
 * @param dataCollection
 */
export function setSorter<E>(sorter: SorterResult<E>, defaultSort: string | undefined, dataCollection: DataCollectionStore<E>) {
  if (sorter && sorter.order) {
    const sortOrderPrefix: string = (sorter.order === 'descend') ? '-' : '+';

    let sortField: string;
    if (sorter.field.endsWith('._instanceName')) {
      sortField = sorter.field.substring(0, sorter.field.indexOf('.'));
    } else {
      sortField = sorter.field;
    }

    dataCollection.sort = sortOrderPrefix + sortField;
  } else {
    dataCollection.sort = defaultSort;
  }
}

/**
 *
 * @param pagination
 * @param dataCollection
 */
export function setPagination<E>(pagination: PaginationConfig, dataCollection: DataCollectionStore<E>) {
  if (pagination && pagination.pageSize && pagination.current) {
    dataCollection.limit = pagination.pageSize;
    dataCollection.offset = pagination.pageSize * (pagination.current - 1);
  }
}

/**
 * `pagination`, `filters` and `sorter` are received in antd `Table`'s `onChange` callback
 *
 * `defaultSort` - name of the field to be sorted by. If the name is preceeding by the '+' character, then the sort order is ascending,
 * if by the '-' character then descending. If there is no special character before the property name, then ascending sort will be used.
 *
 */
export interface TableChangeDTO<E> {
  pagination: PaginationConfig,
  filters: Record<string, string[]>,
  sorter: SorterResult<E>,
  defaultSort: string | undefined,
  fields: string[],
  mainStore: MainStore,
  dataCollection: DataCollectionStore<E>,
}

/**
 * When called from `Table`'s `onChange` callback this function will reload data collection taking into account antd `Table`'s filters, sorter and pagination
 *
 * @param tableChangeDTO
 */
export function handleTableChange<E>(tableChangeDTO: TableChangeDTO<E>) {
  const {
    pagination,
    filters,
    sorter,
    defaultSort,
    fields,
    mainStore,
    dataCollection
  } = tableChangeDTO;

  setFilters(filters, fields, mainStore, dataCollection);
  setSorter(sorter, defaultSort, dataCollection);
  setPagination(pagination, dataCollection);

  dataCollection.load();
}

/**
 * Converts EntityFilter to antd table filters object.
 * Useful e.g. to set the initial state of table filters when the table is loaded with a predefined EntityFilter.
 *
 * @param entityFilter
 * @param fields allows to check the `entityFilter.conditions` against the list of displayed fields and ensure that only
 * the conditions related to the displayed fields are included in the result
 */
export function entityFilterToTableFilters(entityFilter: EntityFilter, fields?: string[]): Record<string, any> {
  const tableFilters: Record<string, any> = {};

  entityFilter.conditions.forEach(condition => {
    if (isConditionsGroup(condition)) {
      // ConditionsGroup cannot be represented in / changed via the table UI
      return;
    }
    condition = condition as Condition;

    // TODO @deprecated We might want to make `fields` parameter mandatory in the next major version
    if (!fields || fields.indexOf(condition.property)) {
      tableFilters[condition.property] = [JSON.stringify({
        operator: condition.operator,
        value: condition.value
      })];
    }
  });

  return tableFilters;
}

export function isConditionsGroup(conditionOrConditionsGroup: Condition | ConditionsGroup): boolean {
  return 'conditions' in conditionOrConditionsGroup;
}

/**
 * Determines whether a condition shall be preserved in `DataCollectionStore` when clearing table filters.
 *
 * @remarks
 * Preserved conditions include `ConditionGroup`s and conditions on fields that are not displayed in the table.
 * Effectively they act as invisible filters that cannot be disabled.
 *
 * @param condition
 * @param fields
 */
export function isPreservedCondition(condition: Condition | ConditionsGroup, fields: string[]): boolean {
  return isConditionsGroup(condition) || fields.indexOf((condition as Condition).property) === -1;
}
