import React, {ReactNode} from 'react';
import {Button, Icon, Spin, Table} from 'antd';
import {
  ColumnFilterItem,
  ColumnProps,
  FilterDropdownProps,
  PaginationConfig,
  SorterResult, TableEventListeners,
  TableProps
} from 'antd/es/table';
import {action, computed, IReactionDisposer, observable, reaction} from 'mobx';
import {
  EntityFilter,
  EnumInfo,
  EnumValueInfo,
  MetaPropertyInfo,
} from '@cuba-platform/rest';
import {observer} from 'mobx-react';
import {DataTableCustomFilter as CustomFilter, ComparisonType, DataTableCustomFilterProps} from './DataTableCustomFilter';
import './DataTable.css';
import {injectMainStore, MainStoreInjected, } from '../../app/MainStore';
import {getPropertyInfo, WithId} from '../../util/metadata';
import {DataCollectionStore} from '../../data/Collection';
import {DataTableCell} from './DataTableCell';
import {FormattedMessage} from 'react-intl';

export interface DataTableProps<E> extends MainStoreInjected {
  dataCollection: DataCollectionStore<E>,
  fields: string[], // TODO remove once DataCollectionStore supports properties field
  onSelectedRowChange: (selectedRowKey: string | number | undefined) => void,
  buttons: JSX.Element[],
  defaultSort: string,
  tableProps?: TableProps<E>,
  columnProps?: ColumnProps<E>,
}

@injectMainStore
@observer
export class DataTable<E> extends React.Component<DataTableProps<E>> {

  @observable selectedRowKey: string | undefined;
  @observable.ref filters: any;
  @observable operatorsByProperty: Record<string, ComparisonType> = {};
  @observable valuesByProperty: Record<string, any> = {};

  reactionDisposer!: IReactionDisposer;
  firstLoad: boolean = true;
  customFilters: Map<string, React.Component<DataTableCustomFilterProps>> =
    new Map<string, React.Component<DataTableCustomFilterProps>>();

  componentDidMount(): void {
    this.reactionDisposer = reaction(
      () => this.props.dataCollection.items,
      () => {
        if (this.props.dataCollection.status === 'DONE' && this.selectedRowKey) {
          const displayedRowKeys = this.props.dataCollection.items.map(item => this.constructRowKey(item));
          if (!displayedRowKeys.includes(this.selectedRowKey)) {
            this.selectedRowKey = undefined;
            this.props.onSelectedRowChange(this.selectedRowKey);
          }
        }
      }
    )
  }

  componentWillUnmount(): void {
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }
  }

  @computed get paginationConfig(): PaginationConfig {
    return {
      showSizeChanger: true,
      total: this.props.dataCollection.count,
    };
  }

  @action
  onChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<E>): void => {
    let filter: EntityFilter | undefined = undefined;
    this.filters = filters;

    if (this.filters) {
      this.props.fields.forEach((propertyName: string) => {
        if (this.filters.hasOwnProperty(propertyName) && this.filters[propertyName] && this.filters[propertyName].length > 0) {
          if (!filter) {
            filter = {
              conditions: []
            };
          }

          if (this.getPropertyInfoNN(propertyName).attributeType === 'ENUM') {
            filter.conditions.push({
              property: propertyName,
              operator: 'in',
              value: this.filters[propertyName],
            });
          } else {
            const {operator, value} = JSON.parse(this.filters[propertyName][0]);
            if (operator === 'inInterval') {
              const {minDate, maxDate} = value;
              filter.conditions.push({
                property: propertyName,
                operator: '>=',
                value: minDate,
              });
              filter.conditions.push({
                property: propertyName,
                operator: '<=',
                value: maxDate,
              });
            } else {
              filter.conditions.push({
                property: propertyName,
                operator,
                value,
              });
            }
          }
        }
      });
    }

    this.props.dataCollection.filter = filter;

    if (sorter && sorter.order) {
      const sortOrderPrefix: string = (sorter.order === 'descend') ? '-' : '+';

      let sortField: string;
      if (sorter.field.endsWith('._instanceName')) {
        sortField = sorter.field.substring(0, sorter.field.indexOf('.'));
      } else {
        sortField = sorter.field;
      }

      this.props.dataCollection.sort = sortOrderPrefix + sortField;
    } else {
      this.props.dataCollection.sort = this.props.defaultSort;
    }

    if (pagination && pagination.pageSize && pagination.current) {
      this.props.dataCollection.limit = pagination.pageSize;
      this.props.dataCollection.offset = pagination.pageSize * (pagination.current - 1);
    }

    this.props.dataCollection.load();
  };

  @action
  onRowClicked = (record: E): void => {
    this.selectedRowKey = this.constructRowKey(record);
    this.props.onSelectedRowChange(this.selectedRowKey);
  };

  @action
  onRowSelectionRadioButtonClicked = (selectedRowKeys: string[] | number[]): void => {
    this.selectedRowKey = selectedRowKeys[0] as string;
    this.props.onSelectedRowChange(this.selectedRowKey);
  };

  onRow = (record: E): TableEventListeners => {
    return {
      onClick: () => {
        this.onRowClicked(record);
      }
    }
  };

  @action
  clearFilters = (): void => {
    this.filters = undefined;
    this.operatorsByProperty = {};
    this.valuesByProperty = {};
    this.customFilters.forEach(customFilter => {
      // @ts-ignore
      customFilter.resetFields(); // Reset Ant Form in CustomFilter
    });
    this.props.dataCollection.filter = undefined;
    this.props.dataCollection.load();
  };

  render() {
    const { items, status } = this.props.dataCollection;

    const isMainStoreAvailable = !!this.props.mainStore
      && !!this.props.mainStore.messages
      && !!this.props.mainStore.metadata
      && !!this.props.mainStore.enums;

    if (!isMainStoreAvailable || (status === "LOADING" && this.firstLoad)) {
      return (<div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <Spin size='large'/>
      </div>);
    }

    this.firstLoad = false;

    const defaultTableProps: TableProps<E> = {
      bodyStyle: { overflowX: 'auto' },
      loading: status === 'LOADING',
      columns: this.generateColumnProps,
      dataSource: items.slice(),
      onChange: this.onChange,
      pagination: this.paginationConfig,
      rowKey: record => this.constructRowKey(record),
      rowSelection: {
        type:'radio',
          selectedRowKeys: [this.selectedRowKey!],
          onChange: this.onRowSelectionRadioButtonClicked,
      },
      onRow: this.onRow,
    };

    const tableProps = { ...defaultTableProps, ...this.props.tableProps };

    return (
      <>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.props.buttons}
          {this.clearFiltersButton}
        </div>
        <Table { ...tableProps } />
      </>
    );
  }

  @computed
  get clearFiltersButton(): ReactNode {
    if (this.props.dataCollection.filter
      && this.props.dataCollection.filter.conditions
      && this.props.dataCollection.filter.conditions.length > 0) {
      return (
        <Button htmlType='button'
                className={'data-table-clear-filters-btn'}
                onClick={this.clearFilters}
                type='link'>
          <Icon type='filter' />
          <span><FormattedMessage id='cubaReact.dataTable.clearAllFilters'/></span>
        </Button>
      );
    } else {
      return null;
    }
  }

  @computed
  get generateColumnProps(): Array<ColumnProps<E>> {
    return this.props.fields.map((property: string) => {

      let dataIndex: string;
      const propertyInfo = this.getPropertyInfoNN(property);

      switch(propertyInfo.attributeType) {
        case 'COMPOSITION':
        case 'ASSOCIATION':
          dataIndex = `${property}._instanceName`;
          break;
        default:
          dataIndex = property;
      }

      let defaultColumnProps: ColumnProps<E> = {
        title: (
          <div
              style={{whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'clip'}}
              title={this.getPropertyCaption(property)}>
            {this.getPropertyCaption(property)}
          </div>
        ),
        dataIndex,
        sorter: true,
        key: property,
        filters: this.generateFilters(property),
        filteredValue: (this.filters && this.filters[property])
          ? this.filters[property].slice() // Turn ObservableArray into plain array
          : null,
        render: this.renderCell.bind(this, propertyInfo)
      };

      if (this.getPropertyInfoNN(property).attributeType !== 'ENUM') {
        defaultColumnProps = {
          filterDropdown: this.generateFilterDropdown(property),
          ...defaultColumnProps
        };
      }

      return { ...defaultColumnProps, ...this.props.columnProps };
    });
  };

  renderCell = (propertyInfo: MetaPropertyInfo, text: any) => DataTableCell({
    text: text,
    propertyInfo: propertyInfo,
    mainStore: this.props.mainStore!
  });

  generateFilters(propertyName: string): ColumnFilterItem[] {
    const propertyInfo: MetaPropertyInfo = this.getPropertyInfoNN(propertyName);

    if (propertyInfo.attributeType === 'ENUM') {
      {
        const propertyEnumInfo: EnumInfo | undefined = this.props.mainStore!.enums!
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
    }

    return [];
  }

  getPropertyInfoNN(propertyName: string): MetaPropertyInfo {
    const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
      this.props.mainStore!.metadata!,
      this.props.dataCollection.entityName,
      propertyName);

    if (!propertyInfo) {
      throw new Error('Cannot find MetaPropertyInfo for property ' + propertyName);
    }

    return propertyInfo;
  }

  generateFilterDropdown(property: string): ((props: FilterDropdownProps) => React.ReactNode) {
    return (props: FilterDropdownProps) => {
      return (
        <CustomFilter entityName={this.props.dataCollection.entityName}
                      entityProperty={property}
                      filterProps={props}
                      operatorsByProperty={this.operatorsByProperty}
                      valuesByProperty={this.valuesByProperty}
                      ref={(instance) => {this.customFilters.set(property, instance);}}
        />
      );
    }
  }

  getPropertyCaption(property: string): string {
    return this.props.mainStore!.messages![this.props.dataCollection.entityName + '.' + property];
  }

  constructRowKey(record: E & WithId): string {
    return record.id!;
  }

}
