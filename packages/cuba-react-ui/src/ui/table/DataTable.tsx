import React, {ReactNode} from 'react';
import {Button, Icon, message, Spin, Table} from 'antd';
import {
  ColumnProps,
  PaginationConfig, RowSelectionType,
  SorterResult, TableEventListeners,
  TableProps
} from 'antd/es/table';
import {action, computed, IReactionDisposer, observable, reaction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {ComparisonType, CustomFilterInputValue, DataTableCustomFilterProps} from './DataTableCustomFilter';
import './DataTable.less';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {
  entityFilterToTableFilters,
  generateDataColumn,
  handleTableChange,
  isPreservedCondition
} from './DataTableHelpers';
import {Condition, ConditionsGroup, EntityAttrPermissionValue} from "@cuba-platform/rest";
import {
  MainStoreInjected,
  DataCollectionStore,
  injectMainStore,
  assertNever,
  getPropertyInfoNN,
  WithId
} from '@cuba-platform/react-core';

// todo may be it make sense to add 'defaultDataTableProps' const instead of describe each property in jsdoc,
//  it's easy to forget update js docs after DataTable.defaultProps changes
/**
 * @typeparam E - entity type.
 */
export interface DataTableProps<E> extends MainStoreInjected, WrappedComponentProps {
  dataCollection: DataCollectionStore<E>,
  /**
   * @deprecated use `columnDefinitions` instead. If used together, `columnDefinitions` will take precedence.
   */
  fields?: string[],
  /**
   * Names of columns that should have filters enabled.
   * Default: filters will be enabled on all columns. Pass empty array to disable all filters.
   */
  enableFiltersOnColumns?: string[],
  /**
   * By default, when any number of filters is active, a `Clear filters` control will be displayed above the
   * table. When clicked, this control disables all filters at once.
   * If `hideClearFilters` is `true`, then the `Clear filters` control won't be displayed.
   * Default: `false`
   */
  hideClearFilters?: boolean,
  /**
   * A callback that takes the ids of the selected rows.
   * Can be used together with {@link buttons} to facilitate CRUD operations or other functionality.
   *
   * @param selectedRowKeys - entity ids corresponding to the selected rows.
   */
  onRowSelectionChange?: (selectedRowKeys: string[]) => void,
  /**
   * `single` allows to select one row at a time.
   * `multi` allows to select multiple rows.
   * `none` disables row selection.
   * Default: `single`.
   */
  rowSelectionMode?: 'single' | 'multi' | 'none',
  /**
   * When `true`, hides the {@link https://3x.ant.design/components/table | selection column}.
   * Default: `false`.
   */
  hideSelectionColumn?: boolean;
  /**
   * When `true`, a row can be selected by clicking on it.
   * When `false`, a row can only be selected using
   * the {@link https://3x.ant.design/components/table | selection column}.
   * Default: `true`.
   */
  canSelectRowByClick?: boolean,
  /**
   * Controls that will be rendered above the table.
   */
  buttons?: JSX.Element[],
  /**
   * Can be used to override any of the underlying
   * {@link https://3x.ant.design/components/table/#Table | Table properties}.
   */
  tableProps?: TableProps<E>,
  /**
   * @deprecated use `columnDefinitions` instead. If used together, `columnDefinitions` will take precedence.
   */
  columnProps?: ColumnProps<E>,
  /**
   * Describes the columns to be displayed. An element of this array can be
   * a property name (which will render a column displaying that property;
   * the column will have the default look&feel)
   * or a {@link ColumnDefinition} object (which allows creating a custom column).
   *
   * NOTE: you need to use either {@link columnDefinitions} or {@link fields} (deprecated)
   * for the `DataTable` to work.
   */
  columnDefinitions?: Array<string | ColumnDefinition<E>>
}

export interface ColumnDefinition<E> {
  /**
   * Entity property name.
   * Use it if you want to create a custom variant of the default property-bound column.
   * In this case the properties in {@link columnProps} will override the default
   * look&feel (defaults will still apply to the properties not contained in {@link columnProps}).
   * If you want to create a custom column that is not bound to an entity property
   * (e.g. an action button column or a calculated field column), do not use this prop.
   */
  field?: string,
  /**
   * If {@link field} is provided, then these properties will override the default look&feel
   * (defaults will still apply to the properties not contained in {@link columnProps}).
   * If you want to create a custom column that is not bound to an entity property
   * (e.g. an action button column or a calculated field column) use this prop only and do not use {@link field}.
   * In this case only the properties present in {@link columnProps} will be applied to the column.
   */
  columnProps: ColumnProps<E>
}

@injectMainStore
@observer
class DataTableComponent<E> extends React.Component<DataTableProps<E>> {

  static readonly NO_COLUMN_DEF_ERROR = 'You need to provide either columnDefinitions or fields prop';

  @observable selectedRowKeys: string[] = [];
  @observable.ref tableFilters: Record<string, any> = {};
  @observable operatorsByProperty: Map<string, ComparisonType> = new Map();
  @observable valuesByProperty: Map<string, CustomFilterInputValue> = new Map();

  // We need to mount and unmount several reactions (listeners) on componentDidMount/componentWillUnmount
  disposers: IReactionDisposer[] = [];

  firstLoad: boolean = true;
  customFilters: Map<string, React.Component<DataTableCustomFilterProps>> =
    new Map<string, React.Component<DataTableCustomFilterProps>>();
  // todo introduce Sort type
  defaultSort: string | undefined;

  constructor(props: DataTableProps<E>) {
    super(props);

    const {filter, sort} = this.props.dataCollection;
    if (filter) {
      this.tableFilters = entityFilterToTableFilters(filter, this.fields);
    }
    this.defaultSort = sort;
  }

  static defaultProps = {
    rowSelectionMode: 'single' as 'single' | 'multi' | 'none',
    canSelectRowByClick: true,
    hideSelectionColumn: false,
    hideClearFilters: false,
  };

  componentDidMount(): void {

    // When dataCollection.items has changed (e.g. due to sorting, filtering or pagination change) some of the selected rows
    // may not be displayed anymore and shall be removed from selectedRowKeys
    this.disposers.push(reaction(
      () => this.props.dataCollection,
      dataCollection => {
        if (this.isRowSelectionEnabled && this.selectedRowKeys.length > 0 && dataCollection.status === 'DONE') {

          const displayedRowKeys = dataCollection.items.map(item => this.constructRowKey(item));

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

    // Display error message if dataCollection.load has failed
    this.disposers.push(reaction(
      () => this.props.dataCollection.status,
      (status) => {
        const {intl} = this.props;
        if (status === 'ERROR') {
          message.error(intl.formatMessage({id: 'common.requestFailed'}));
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
        throw new Error(`${this.errorContext} rowSelectionMode is not expected to be ${this.props.rowSelectionMode} at this point`);
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

  get isRowSelectionEnabled(): boolean {
    if (!this.props.rowSelectionMode) {
      throw new Error(`${this.errorContext} rowSelectionMode is expected to be defined at this point`);
    }
    return ['single', 'multi'].indexOf(this.props.rowSelectionMode) > -1;
  }

  get errorContext(): string {
    return `[DataTable, entity: ${this.props.dataCollection.entityName}]`;
  }

  @computed get fields(): string[] {

    const {columnDefinitions, fields} = this.props;

    if (columnDefinitions != null) {
      return columnDefinitions.reduce((accumulatedFields: string[], columnDefinition: string | ColumnDefinition<E>) => {
        if (typeof columnDefinition === 'string') {
          accumulatedFields.push(columnDefinition);
        } else if (typeof (columnDefinition.field === 'string')) {
          accumulatedFields.push(columnDefinition.field!);
        }
        return accumulatedFields;
      }, []);
    }

    if (fields != null) {
      return fields;
    }

    throw new Error(`${this.errorContext} ${DataTableComponent.NO_COLUMN_DEF_ERROR}`);
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
  handleFilterValueChange = (value: CustomFilterInputValue, propertyName: string) => {
    this.valuesByProperty.set(propertyName, value);
  };

  @action
  onChange = (pagination: PaginationConfig, filters: Record<string, any>, sorter: SorterResult<E>): void => {
    this.tableFilters = filters;

    const {defaultSort, fields} = this;
    const {dataCollection} = this.props;
    const mainStore = this.props.mainStore!;

    handleTableChange<E>({
      pagination, filters, sorter, defaultSort, fields, mainStore, dataCollection
    });
  };

  @action
  onRowClicked = (record: E): void => {
    if (this.isRowSelectionEnabled) {
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
    if (this.isRowSelectionEnabled) {
      this.selectedRowKeys = selectedRowKeys as string[];
    }
  };

  @action
  onRow = (record: E): TableEventListeners => {
    return {
      onClick: () => this.onRowClicked(record)
    }
  };

  @action
  clearFilters = (): void => {
    this.tableFilters = {};
    this.operatorsByProperty.clear();
    this.valuesByProperty.clear();

    const {filter, load, entityName} = this.props.dataCollection;

    this.fields.forEach((field: string) => {
      const propertyInfo = getPropertyInfoNN(field, entityName, this.props.mainStore!.metadata!);
      if (propertyInfo.type === 'boolean') {
        this.valuesByProperty.set(field, 'true');
      }
    });

    this.customFilters.forEach(customFilter => {
      // @ts-ignore
      customFilter.resetFields(); // Reset Ant Form in CustomFilter
    });

    if (filter) {
      const preservedConditions: Array<Condition | ConditionsGroup> = filter.conditions
        .filter(condition => isPreservedCondition(condition, this.fields));

      if (preservedConditions.length > 0) {
        filter.conditions = preservedConditions;
      } else {
        this.props.dataCollection.filter = undefined;
      }
    }
    load();
  };

  get rowSelectionType(): RowSelectionType {
    switch (this.props.rowSelectionMode) {
      case 'multi':
        return 'checkbox';
      case 'single':
        return 'radio';
      default:
        throw new Error(`${this.errorContext} rowSelectionMode is not expected to be ${this.props.rowSelectionMode} at this point`);
    }
  }

  render() {
    const { items, status } = this.props.dataCollection;

    if (this.props.mainStore?.isEntityDataLoaded() !== true || (status === "LOADING" && this.firstLoad)) {
      return (
        <div className='cuba-data-table-loader'>
          <Spin size='large'/>
        </div>
      );
    }

    this.firstLoad = false;

    let defaultTableProps: TableProps<E> = {
      bodyStyle: { overflowX: 'auto' },
      loading: status === 'LOADING',
      columns: this.generateColumnProps,
      dataSource: toJS(items),
      onChange: this.onChange,
      pagination: this.paginationConfig,
      rowKey: record => this.constructRowKey(record),
    };

    if (this.isRowSelectionEnabled) {
      defaultTableProps = {
        ...defaultTableProps,
        rowSelection: {
          type: this.rowSelectionType,
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
      <div className='cuba-data-table'>
        <div className='buttons'>
          {this.props.buttons}
          {this.props.hideClearFilters ? null : this.clearFiltersButton}
        </div>
        <Table { ...tableProps } className={this.props.hideSelectionColumn ? '_cuba-hide-selection-column' : ''} />
      </div>
    );
  }

  @computed get clearFiltersButton(): ReactNode {
    if (this.isClearFiltersShown) {
      return (
        <Button htmlType='button'
                className='cuba-data-table-clear-filters'
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

  get isClearFiltersShown(): boolean {
    const {filter} =  this.props.dataCollection;

    return filter != null && filter.conditions != null
      && filter.conditions.some(condition => !isPreservedCondition(condition, this.fields));
  }

  @computed
  get generateColumnProps(): Array<ColumnProps<E>> {
    const {columnDefinitions, fields, dataCollection, mainStore} = this.props;

    const source = columnDefinitions ? columnDefinitions : fields;
    if (!source) {
      throw new Error(`${this.errorContext} ${DataTableComponent.NO_COLUMN_DEF_ERROR}`);
    }

    return source
      .filter((columnDef: string | ColumnDefinition<E>) => {
        const {getAttributePermission} = mainStore!.security;
        const propertyName = columnDefToPropertyName(columnDef);
        if (propertyName) {
          const perm: EntityAttrPermissionValue = getAttributePermission(dataCollection.entityName, propertyName);
          return perm === 'MODIFY' || perm === 'VIEW';
        }
        return true; // Column not bound to an entity attribute
      })
      .map((columnDef: string | ColumnDefinition<E>) => {
        const propertyName = columnDefToPropertyName(columnDef);
        const columnSettings = (columnDef as ColumnDefinition<E>).columnProps;

        if (propertyName != null) {
          // Column is bound to an entity property

          const generatedColumnProps = generateDataColumn<E>({
            propertyName,
            entityName: dataCollection.entityName,
            enableFilter: this.isFilterForColumnEnabled(propertyName),
            filters: this.tableFilters,
            operator: this.operatorsByProperty.get(propertyName),
            onOperatorChange: this.handleFilterOperatorChange,
            value: this.valuesByProperty.get(propertyName),
            onValueChange: this.handleFilterValueChange,
            enableSorter: true,
            mainStore: mainStore!,
            customFilterRef: (instance: any) => this.customFilters.set(propertyName, instance)
          });

          return {
            ...generatedColumnProps,
            ...this.props.columnProps, // First we add customizations from columnProps TODO @deprecated
            ...(columnSettings ? columnSettings : []) // Then we add customizations from columnDefinitions
          };
        }

        if (columnSettings != null) {
          // Column is not be bound to an entity property. It is a column fully constructed by client.
          // E.g. it can be a calculated column or an action column.
          return columnSettings;
        }

        throw new Error(`${this.errorContext} Neither field name nor columnProps were provided`);
    });
  };

  isFilterForColumnEnabled(propertyName: string): boolean {
    return this.props.enableFiltersOnColumns
      ? this.props.enableFiltersOnColumns.indexOf(propertyName) > -1
      : true;
  }

  constructRowKey(record: E & WithId): string {
    return record.id!;
  }

}

function columnDefToPropertyName<E>(columnDef: string | ColumnDefinition<E>): string | undefined {
  return typeof columnDef === 'string' ? columnDef : columnDef.field;
}

const dataTable = injectIntl(DataTableComponent);
export {dataTable as DataTable};