import React, {ReactNode} from 'react';
import {Button, Icon, Spin, Table} from 'antd';
import {
  ColumnProps,
  PaginationConfig, RowSelectionType,
  SorterResult, TableEventListeners,
  TableProps
} from 'antd/es/table';
import {action, computed, IReactionDisposer, observable, reaction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {ComparisonType, DataTableCustomFilterProps} from './DataTableCustomFilter';
import './DataTable.css';
import {injectMainStore, MainStoreInjected, } from '../../app/MainStore';
import {getPropertyInfoNN, WithId} from '../../util/metadata';
import {DataCollectionStore} from '../../data/Collection';
import {FormattedMessage} from 'react-intl';
import {entityFilterToTableFilters, generateDataColumn, handleTableChange} from './DataTableHelpers';
import {assertNever} from '../../util/errorHandling';

export interface DataTableProps<E> extends MainStoreInjected {
  dataCollection: DataCollectionStore<E>,
  fields: string[], // TODO remove once DataCollectionStore supports properties field
  /**
   * Default: filters will be enabled on all columns
   */
  enableFiltersOnColumns?: string[],
  /**
   * Default: `false`
   */
  hideClearFilters?: boolean,
  onRowSelectionChange?: (selectedRowKeys: string[]) => void,
  /**
   * Default: `single`.
   */
  rowSelectionMode?: 'single' | 'multi' | 'none',
  /**
   * Default: `false`.
   */
  hideSelectionColumn?: boolean;
  /**
   * Default: `true`.
   */
  canSelectRowByClick?: boolean,
  buttons?: JSX.Element[],
  tableProps?: TableProps<E>,
  columnProps?: ColumnProps<E>,
}

@injectMainStore
@observer
export class DataTable<E> extends React.Component<DataTableProps<E>> {
  @observable selectedRowKeys: string[] = [];
  @observable.ref tableFilters: Record<string, any> = {};
  @observable operatorsByProperty: Map<string, ComparisonType> = new Map();
  @observable valuesByProperty: Map<string, any> = new Map();

  disposers: IReactionDisposer[] = [];
  firstLoad: boolean = true;
  customFilters: Map<string, React.Component<DataTableCustomFilterProps>> =
    new Map<string, React.Component<DataTableCustomFilterProps>>();
  defaultSort: string | undefined;

  constructor(props: DataTableProps<E>) {
    super(props);

    if (this.props.dataCollection.filter) {
      this.tableFilters = entityFilterToTableFilters(this.props.dataCollection.filter);
    }

    this.defaultSort = this.props.dataCollection.sort;
  }

  static defaultProps = {
    rowSelectionMode: 'single',
    canSelectRowByClick: true,
    hideSelectionColumn: false,
    hideClearFilters: false,
  };

  componentDidMount(): void {

    // When dataCollection.items has changed (e.g. due to sorting, filtering or pagination change) some of the selected rows
    // may not be displayed anymore and shall be removed from selectedRowKeys
    this.disposers.push(reaction(
      () => this.props.dataCollection.items,
      () => {
        if (this.isRowSelectionEnabled() && this.selectedRowKeys.length > 0 && this.props.dataCollection.status === 'DONE') {

          const displayedRowKeys = this.props.dataCollection.items.map(item => this.constructRowKey(item));

          const displayedSelectedKeys: string[] = [];

          this.selectedRowKeys.forEach((selectedKey: string) => {
            if (displayedRowKeys.indexOf(selectedKey) > -1) {
              displayedSelectedKeys.push(selectedKey);
            }
          });

          this.selectedRowKeys = displayedSelectedKeys;
        }
      }
    ));

    // Call corresponding callback(s) when selectedRowKeys is changed
    this.disposers.push(reaction(
      () => this.selectedRowKeys,
      this.onRowSelectionChange
    ));

    // Clear row selection when rowSelectionMode is changed
    this.disposers.push(reaction(
      () => this.props.rowSelectionMode,
      () => {
        this.selectedRowKeys = [];
      }
    ))
  }

  componentWillUnmount(): void {
    this.disposers.forEach((dispose: IReactionDisposer) => dispose());
  }

  onRowSelectionChange = () => {
    switch (this.props.rowSelectionMode) {
      case undefined:
        throw new Error(`rowSelectionMode is not expected to be ${this.props.rowSelectionMode} at this point`);
      case 'none':
        return;
      case 'multi':
      case 'single':
        if (this.props.onRowSelectionChange) {
          this.props.onRowSelectionChange(this.selectedRowKeys);
        }
        break;
      default:
        assertNever('rowSelectionMode', this.props.rowSelectionMode);
    }
  };

  isRowSelectionEnabled(): boolean {
    if (this.props.rowSelectionMode) {
      return ['single', 'multi'].indexOf(this.props.rowSelectionMode) > -1;
    } else {
      throw new Error(`rowSelectionMode is expected to be defined at this point`);
    }
  }

  @computed get paginationConfig(): PaginationConfig {
    return {
      showSizeChanger: true,
      total: this.props.dataCollection.count,
    };
  }

  @action
  handleFilterOperatorChange = (operator: ComparisonType, propertyName: string) => {
    this.operatorsByProperty.set(propertyName, operator);
  };

  @action
  handleFilterValueChange = (value: any, propertyName: string) => {
    this.valuesByProperty.set(propertyName, value);
  };

  @action
  onChange = (pagination: PaginationConfig, tableFilters: Record<string, any>, sorter: SorterResult<E>): void => {
    this.tableFilters = tableFilters;
    handleTableChange<E>({
      pagination,
      filters: tableFilters,
      sorter,
      defaultSort: this.defaultSort,
      fields: this.props.fields,
      mainStore: this.props.mainStore!,
      dataCollection: this.props.dataCollection
    });
  };

  @action
  onRowClicked = (record: E): void => {
    if (this.isRowSelectionEnabled()) {
      const clickedRowKey = this.constructRowKey(record);

      let newSelectedRowKeys = this.selectedRowKeys.slice();

      switch (this.props.rowSelectionMode) {
        case 'multi':
          const clickedRowKeyIndex = this.selectedRowKeys.indexOf(clickedRowKey);
          if (clickedRowKeyIndex > -1) {
            // Deselect row in 'multi' mode
            newSelectedRowKeys.splice(clickedRowKeyIndex, 1);
          } else {
            // Select row in 'multi' mode
            newSelectedRowKeys.push(clickedRowKey);
          }
          break;
        case 'single':
          if (this.selectedRowKeys.length > 0 && this.selectedRowKeys[0] === clickedRowKey) {
            // Deselect row in 'single' mode
            newSelectedRowKeys = [];
          } else {
            // Select row in 'single' mode
            newSelectedRowKeys[0] = clickedRowKey;
          }
          break;
      }

      this.selectedRowKeys = newSelectedRowKeys;
    }
  };

  @action
  onRowSelectionColumnClicked = (selectedRowKeys: string[] | number[]): void => {
    if (this.isRowSelectionEnabled()) {
      this.selectedRowKeys = selectedRowKeys as string[];
    }
  };

  @action
  onRow = (record: E): TableEventListeners => {
    return {
      onClick: () => {
        this.onRowClicked(record);
      }
    }
  };

  @action
  clearFilters = (): void => {
    this.tableFilters = {};
    this.operatorsByProperty.clear();

    this.valuesByProperty.clear();
    this.props.fields.forEach((field: string) => {
      const propertyInfo = getPropertyInfoNN(field, this.props.dataCollection.entityName, this.props.mainStore!.metadata!);
      if (propertyInfo.type === 'boolean') {
        this.valuesByProperty.set(field, 'true');
      }
    });

    this.customFilters.forEach(customFilter => {
      // @ts-ignore
      customFilter.resetFields(); // Reset Ant Form in CustomFilter
    });
    this.props.dataCollection.filter = undefined;
    this.props.dataCollection.load();
  };

  rowSelectionType(): RowSelectionType {
    switch (this.props.rowSelectionMode) {
      case 'multi':
        return 'checkbox';
      case 'single':
        return 'radio';
      default:
        throw new Error(`rowSelectionMode is not expected to be ${this.props.rowSelectionMode} at this point`);
    }
  }

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

    let defaultTableProps: TableProps<E> = {
      bodyStyle: { overflowX: 'auto' },
      loading: status === 'LOADING',
      columns: this.generateColumnProps,
      dataSource: items.slice(),
      onChange: this.onChange,
      pagination: this.paginationConfig,
      rowKey: record => this.constructRowKey(record),
    };

    if (this.isRowSelectionEnabled()) {
      defaultTableProps = {
        ...defaultTableProps,
        rowSelection: {
          type: this.rowSelectionType(),
          selectedRowKeys: toJS(this.selectedRowKeys),
          onChange: this.onRowSelectionColumnClicked,
        },
      };

      if (this.props.canSelectRowByClick) {
        defaultTableProps = {
          ...defaultTableProps,
          onRow: this.onRow,
        };
      }
    }

    const tableProps = { ...defaultTableProps, ...this.props.tableProps };

    return (
      <>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {this.props.buttons}
          {this.props.hideClearFilters ? null : this.clearFiltersButton}
        </div>
        <Table { ...tableProps } className={this.props.hideSelectionColumn ? 'data-table-hide-selection-column' : ''} />
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
    return this.props.fields.map((property) => {
      const generatedColumnProps = generateDataColumn<E>({
        propertyName: property,
        entityName: this.props.dataCollection.entityName,
        enableFilter: this.enableFilterForColumn(property),
        filters: this.tableFilters,
        operator: this.operatorsByProperty.get(property),
        onOperatorChange: this.handleFilterOperatorChange,
        value: this.valuesByProperty.get(property),
        onValueChange: this.handleFilterValueChange,
        enableSorter: true,
        mainStore: this.props.mainStore!,
        customFilterRef: (instance: any) => this.customFilters.set(property, instance)
      });

      return { ...generatedColumnProps, ...this.props.columnProps };
    });
  };

  enableFilterForColumn(propertyName: string) {
    return this.props.enableFiltersOnColumns
      ? this.props.enableFiltersOnColumns.indexOf(propertyName) > -1
      : true;
  }

  constructRowKey(record: E & WithId): string {
    return record.id!;
  }

}
