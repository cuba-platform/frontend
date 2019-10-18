import React, {ReactNode} from 'react';
import {Button, Icon, Spin, Table} from 'antd';
import {
  ColumnProps,
  PaginationConfig,
  SorterResult, TableEventListeners,
  TableProps
} from 'antd/es/table';
import {action, computed, IReactionDisposer, observable, reaction} from 'mobx';
import {observer} from 'mobx-react';
import {ComparisonType, DataTableCustomFilterProps} from './DataTableCustomFilter';
import './DataTable.css';
import {injectMainStore, MainStoreInjected, } from '../../app/MainStore';
import {getPropertyInfoNN, WithId} from '../../util/metadata';
import {DataCollectionStore} from '../../data/Collection';
import {FormattedMessage} from 'react-intl';
import {entityFilterToTableFilters, generateColumnWithCustomFilter, handleTableChange} from './DataTableHelpers';

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
  @observable.ref tableFilters: Record<string, any> = {};
  @observable operatorsByProperty: Map<string, ComparisonType> = new Map();
  @observable valuesByProperty: Map<string, any> = new Map();

  reactionDisposer!: IReactionDisposer;
  firstLoad: boolean = true;
  customFilters: Map<string, React.Component<DataTableCustomFilterProps>> =
    new Map<string, React.Component<DataTableCustomFilterProps>>();

  constructor(props: DataTableProps<E>) {
    super(props);

    if (this.props.dataCollection.filter) {
      this.tableFilters = entityFilterToTableFilters(this.props.dataCollection.filter);
    }
  }

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
      defaultSort: this.props.defaultSort,
      fields: this.props.fields,
      mainStore: this.props.mainStore!,
      dataCollection: this.props.dataCollection
    });
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
    return this.props.fields.map((property) => {
      const generatedColumnProps = generateColumnWithCustomFilter<E>({
        propertyName: property,
        entityName: this.props.dataCollection.entityName,
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

  constructRowKey(record: E & WithId): string {
    return record.id!;
  }

}
