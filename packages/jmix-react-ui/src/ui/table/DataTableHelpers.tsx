import {ColumnProps, TablePaginationConfig} from 'antd/es/table';
import {SorterResult, ColumnFilterItem, FilterDropdownProps} from 'antd/es/table/interface';
import React, { ReactText } from 'react';
import {
  Condition,
  ConditionsGroup,
  EntityFilter,
  EnumInfo,
  EnumValueInfo,
  MetaPropertyInfo
} from '@haulmont/jmix-rest';
import {DataTableCell} from './DataTableCell';
import {
  ComparisonType,
  DataTableCustomFilter as CustomFilter,
} from './DataTableCustomFilter';
import { toJS } from 'mobx';
import { MainStore, getPropertyInfoNN, DataCollectionStore, getPropertyCaption, isPropertyTypeSupported } from '@haulmont/jmix-react-core';
import {OperatorType, FilterValue} from "@haulmont/jmix-rest";
import {setPagination} from "../paging/Paging";
import {Key} from 'antd/es/table/interface';
import { FormInstance } from 'antd/es/form';

// todo we should not use '*Helpers' in class name in case of lack semantic. This class need to be split
//  to different files like 'DataColumn', 'Conditions', 'Filters', 'Paging' ot something like this
//  https://github.com/cuba-platform/frontend/issues/133

export interface DataColumnConfig {
  propertyName: string,
  entityName: string,
  /**
   * Whether to enable a filter for this column
   */
  enableFilter: boolean,
  /**
   * An object received in antd {@link https://ant.design/components/table | Table}'s `onChange` callback,
   * it is a mapping between column names and currently applied filters.
   */
  filters: Record<string, any> | undefined,
  /**
   * See {@link DataTableCustomFilterProps.operator}
   */
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  /**
   * See {@link DataTableCustomFilterProps.value}
   */
  // TODO probably type should be changed to CustomFilterInputValue
  value: any,
  onValueChange: (value: any, propertyName: string) => void,
  /**
   * Whether to enable sorting on this column
   */
  enableSorter: boolean,
  mainStore: MainStore,
  /**
   * See {@link DataTableCustomFilterProps.customFilterRef}
   */
  customFilterRef?: (instance: FormInstance) => void
}

/**
 * @remarks
 * It is possible to create a vanilla antd `Table` and customize some of its columns
 * with `DataTable`'s custom filters using this helper function.
 *
 * NOTE: it might be simpler to achieve the desired result using {@link DataTableProps.columnDefinitions}.
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
 *
 */
// todo refactor - extract DataColumn class
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

  let dataIndex: string | string[];
  const propertyInfo = getPropertyInfoNN(propertyName as string, entityName, mainStore!.metadata!);

  switch(propertyInfo.attributeType) {
    case 'COMPOSITION':
    case 'ASSOCIATION':
      dataIndex = [propertyName, '_instanceName'];
      break;
    default:
      dataIndex = propertyName as string;
  }

  const localizedPropertyCaption = getPropertyCaption(propertyName as string, entityName, mainStore!.messages!);

  let defaultColumnProps: ColumnProps<EntityType> = {
    title: (
      <div
        title={localizedPropertyCaption}>
          {localizedPropertyCaption}
        </div>
      ),
    dataIndex,
    sorter: enableSorter,
    key: propertyName as string,
    render: (text, record) => DataTableCell<EntityType>({propertyInfo, text, mainStore, record})
  };

  if (enableFilter && isPropertyTypeSupported(propertyInfo)) {
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
    .find((enumInfo: EnumInfo) => enumInfo.name === propertyInfo.type);

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

// todo - after extraction DataColumn class move this method to DataColumn and inline
export function generateCustomFilterDropdown(
  propertyName: string,
  entityName: string,
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  value: any,
  onValueChange: (value: any, propertyName: string) => void,
  customFilterRefCallback?: (instance: FormInstance) => void,
): (props: FilterDropdownProps) => React.ReactNode {

  return (props: FilterDropdownProps) => (
    <CustomFilter entityName={entityName}
                  entityProperty={propertyName}
                  filterProps={props}
                  operator={operator}
                  onOperatorChange={onOperatorChange}
                  value={value}
                  onValueChange={onValueChange}
                  customFilterRef={customFilterRefCallback}
    />
  )

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
  tableFilters: Record<string, ReactText[] | null>,
  fields: string[],
  mainStore: MainStore,
  dataCollection: DataCollectionStore<E>,
) {
  let entityFilter: EntityFilter | undefined;

  if (dataCollection.filter && dataCollection.filter.conditions && dataCollection.filter.conditions.length > 0) {

    const preservedConditions: Array<Condition | ConditionsGroup> = dataCollection.filter.conditions
      .filter(condition => isPreservedCondition(condition, fields));

    if (preservedConditions.length > 0) {
      entityFilter = {
        conditions: preservedConditions
      };
    }
  }

  if (tableFilters) {
    fields.forEach((propertyName: string) => {
      if (tableFilters.hasOwnProperty(propertyName)
          && tableFilters[propertyName] != null
          && tableFilters[propertyName]!.length > 0) {
        if (!entityFilter) {
          entityFilter = {
            conditions: []
          };
        }

        const propertyInfoNN = getPropertyInfoNN(propertyName as string, dataCollection.entityName, mainStore.metadata!);
        if (propertyInfoNN.attributeType === 'ENUM') {
          pushCondition(entityFilter, propertyName, 'in', tableFilters[propertyName]);
        } else {
          const {operator, value} = JSON.parse(String(tableFilters[propertyName]![0]));
          if (operator === 'inInterval') {
            const {minDate, maxDate} = value;
            pushCondition(entityFilter, propertyName, '>=', minDate);
            pushCondition(entityFilter, propertyName, '<=', maxDate);
          } else {
            pushCondition(entityFilter, propertyName, operator, value);
          }
        }
      }
    });
  }

  dataCollection.filter = entityFilter;
}

function pushCondition(ef: EntityFilter,
                       property: string,
                       operator: OperatorType,
                       val: ReactText | ReactText[] | null) {
  const value = val as FilterValue;
  ef.conditions.push({property, operator, value});
}

/**
 * Sets sort field/order on provided `dataCollection` based on current state of table `sorter`.
 *
 * @param sorter
 * @param defaultSort name of the field to be sorted by. If the name is preceeding by the '+' character, then the sort order is ascending,
 * if by the '-' character then descending. If there is no special character before the property name, then ascending sort will be used.
 * @param dataCollection
 */
// todo could we make defaultSort of type defined as properties keys of 'E' ?
export function setSorter<E>(sorter: SorterResult<E> | Array<SorterResult<E>>, defaultSort: string | undefined, dataCollection: DataCollectionStore<E>) {
  if (sorter != null && !Array.isArray(sorter) && sorter.order != null) {
    const sortOrderPrefix: string = (sorter.order === 'descend') ? '-' : '+';

    let sortField: string;
    if (typeof sorter.field === 'string' && sorter.field.endsWith('._instanceName')) {
      sortField = sorter.field.substring(0, sorter.field.indexOf('.'));
    } else {
      sortField = String(sorter.field);
    }

    dataCollection.sort = sortOrderPrefix + sortField;
  } else {
    dataCollection.sort = defaultSort;
  }
}

/**
 * @typeparam E - entity type
 */
export interface TableChangeDTO<E> {
  /**
   * Received in antd {@link https://ant.design/components/table | Table}'s `onChange` callback
   */
  pagination: TablePaginationConfig,
  /**
   * Received in antd {@link https://ant.design/components/table | Table}'s `onChange` callback
   */
  filters: Record<string, Key[] | null>,
  /**
   * Received in antd {@link https://ant.design/components/table | Table}'s `onChange` callback
   */
  sorter: SorterResult<E> | Array<SorterResult<E>>,
  /**
   * Default sort order.
   * Property name opionally preceeded by `+` or `-` character.
   * If the name is preceeded by `+`, or there is no preceeding character, then the sort order is ascending.
   * If the name is preceeded by `-`, then the sort order is descending.
   */
  defaultSort: string | undefined,
  /**
   * Names of the entity properties that should be displayed.
   */
  fields: string[],
  mainStore: MainStore,
  dataCollection: DataCollectionStore<E>,
}

/**
 * When called from antd {@link https://ant.design/components/table | Table}'s `onChange` callback
 * this function will reload data collection taking into account `Table`'s filters, sorter and pagination.
 *
 * @typeparam E - entity type.
 *
 * @param tableChangeDTO
 */
export function handleTableChange<E>(tableChangeDTO: TableChangeDTO<E>): Promise<void> {
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

  return dataCollection.load();
}

/**
 * Converts EntityFilter to antd table filters object.
 * Useful e.g. to set the initial state of table filters when the table is loaded with a predefined EntityFilter.
 *
 * @param entityFilter
 * @param fields - names of the entity properties displayed in the table.
 * Allows to check the `EntityFilter.conditions` against the list of displayed fields and ensure that only
 * the conditions related to the displayed fields are used.
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
 * @param fields - names of the entity properties displayed in the table
 */
export function isPreservedCondition(condition: Condition | ConditionsGroup, fields: string[]): boolean {
  return isConditionsGroup(condition) || fields.indexOf((condition as Condition).property) === -1;
}
