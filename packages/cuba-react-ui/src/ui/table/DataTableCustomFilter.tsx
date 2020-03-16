import React, {FormEvent, ReactNode} from 'react';
import {Button, DatePicker, Divider, Form, Input, message, Select, Spin, TimePicker} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import {FilterDropdownProps} from 'antd/es/table';
import {observer} from 'mobx-react';
import {MetaClassInfo, MetaPropertyInfo, NumericPropertyType, OperatorType, PropertyType} from '@cuba-platform/rest';
import {action, computed, observable} from 'mobx';
import moment, {Moment} from 'moment';
import {DataTableListEditor} from './DataTableListEditor';
import {DataTableIntervalEditor, TemporalInterval} from './DataTableIntervalEditor';
import './DataTableCustomFilter.less';
import './DataTableFilterControlLayout.less';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import {injectIntl, WrappedComponentProps, FormattedMessage} from 'react-intl';
import {
  MainStoreInjected,
  injectMainStore,
  WithId,
  getCubaREST,
  getPropertyInfo,
  assertNever, getDataTransferFormat
} from '@cuba-platform/react-core';
import {IntegerInput} from "../form/IntegerInput";
import {BigDecimalInput} from "../form/BigDecimalInput";
import {DoubleInput} from "../form/DoubleInput";
import {LongInput} from "../form/LongInput";
import {UuidInput} from '../form/UuidInput';
import {uuidPattern} from "../../util/regex";
import {LabeledValue} from "antd/es/select";
import {decorateAndWrapInFormItem, getDefaultFieldDecoratorOptions} from './DataTableHelpers';

export interface CaptionValuePair {
  caption: string;
  value: string | number | undefined;
}

export type CustomFilterInputValue = string | number | boolean | string[] | number[] | TemporalInterval | undefined;

export interface DataTableCustomFilterProps extends FormComponentProps, MainStoreInjected {
  entityName: string,
  entityProperty: string,
  filterProps: FilterDropdownProps,
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  value: CustomFilterInputValue,
  onValueChange: (value: CustomFilterInputValue, propertyName: string) => void,
  ref?: (instance: React.Component<DataTableCustomFilterProps>) => void,
}

export type ComparisonType = OperatorType | 'inInterval';

enum OperatorGroup {
  SINGLE_VALUE = 'singleValue',
  LIST_VALUE = 'listValue',
  LOGICAL_VALUE = 'logicalValue',
  INTERVAL_VALUE = 'intervalValue',
}

@injectMainStore
@observer
class DataTableCustomFilterComponent<E extends WithId>
  extends React.Component<DataTableCustomFilterProps & WrappedComponentProps> {

  @observable nestedEntityOptions: CaptionValuePair[] = [];
  @observable loading = true;

  // tslint:disable-next-line:ban-types
  getFieldDecorator!: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode;

  set operator(operator: ComparisonType) {
    this.props.onOperatorChange(operator, this.props.entityProperty);
  }

  get operator(): ComparisonType {
    return this.props.operator || this.getDefaultOperator();
  }

  set value(value: CustomFilterInputValue) {
    this.props.onValueChange(value, this.props.entityProperty);
  }

  get value(): CustomFilterInputValue {
    return this.props.value;
  }

  constructor(props: DataTableCustomFilterProps & WrappedComponentProps) {
    super(props);

    this.initValue();
  }

  componentDidMount(): void {
    const propertyInfo: MetaPropertyInfo = this.propertyInfoNN;
    const metaClassInfo: MetaClassInfo | undefined = this.props.mainStore!.metadata!.find((classInfo: MetaClassInfo) => {
      return classInfo.entityName === propertyInfo.type;
    });

    if (metaClassInfo) {
      // This is a nested entity column. Fetch select options.
      getCubaREST()!.loadEntities<E>(metaClassInfo.entityName, {view: '_minimal'})
        .then(
          (resp) => {
            resp.forEach((instance) => {
              this.nestedEntityOptions.push({
                caption: instance._instanceName || '',
                value: instance.id
              });
            });
            this.loading = false;
          }
        )
        .catch(
          () => {
            message.error(this.props.intl.formatMessage({id: 'cubaReact.dataTable.failedToLoadNestedEntities'}));
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
    }
  }

  get errorContext(): string {
    return `[DataTableCustomFilter, entity: ${this.props.entityName}, property: ${this.props.entityProperty}]`;
  }

  @computed get propertyCaption(): string {
    return this.props.mainStore!.messages![this.props.entityName + '.' + this.props.entityProperty];
  }

  @computed get propertyInfoNN(): MetaPropertyInfo {
    const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
      this.props.mainStore!.metadata!,
      this.props.entityName,
      this.props.entityProperty);

    if (!propertyInfo) {
      throw new Error(`${this.errorContext} Cannot find MetaPropertyInfo`);
    }

    return propertyInfo;
  }

  @action
  handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.filterProps.setSelectedKeys!(
          [
            JSON.stringify({
              operator: this.operator,
              value: this.value
            })
          ]
        );
        this.props.filterProps.confirm!();
      }
    });
  };

  initValue = (): void => {
    if (this.operator === 'notEmpty' || this.propertyInfoNN.type === 'boolean') {
      this.value = true;
    } else {
      this.value = undefined;
    }
  };

  @action
  resetFilter = (): void => {
    this.props.form.resetFields();
    this.operator = this.getDefaultOperator();
    this.initValue();

    // @ts-ignore
    this.props.filterProps.clearFilters!(this.props.filterProps.selectedKeys!);
  };

  @action
  changeOperator = (newOperator: ComparisonType): void => {
    const oldOperator: ComparisonType = this.operator;

    const oldOperatorGroup: OperatorGroup = determineOperatorGroup(oldOperator);
    const newOperatorGroup: OperatorGroup = determineOperatorGroup(newOperator);

    this.operator = newOperator;

    if (oldOperatorGroup !== newOperatorGroup) {
      this.props.form.resetFields();
      this.initValue();
    }
  };

  @action
  onTextInputChange = (event: any): void => {
    this.value = event.target.value;
  };

  @action
  onNumberInputChange = (value: number | undefined): void => {
    this.value = value;
  };

  @action
  onDatePickerChange = (date: Moment | null, _dateString: string): void => {
    if (date) {
      this.value = date.format(getDataTransferFormat(this.propertyInfoNN.type as PropertyType));
    }
  };

  @action
  onTimePickerChange = (time: Moment | null, _timeString: string): void => {
    if (time) {
      this.value = time.format(getDataTransferFormat(this.propertyInfoNN.type as PropertyType));
    }
  };

  @action
  onDateTimePickerChange = (dateTime: Moment, _timeString: string): void => {
    if (dateTime) {
      this.value = dateTime.format(getDataTransferFormat(this.propertyInfoNN.type as PropertyType));
    }
  };

  @action
  onYesNoSelectChange = (value: string | number | LabeledValue): void => {
    this.value = (value === 'true');
  };

  @action
  onSelectChange = (value: string | number | LabeledValue): void => {
    this.value = value as string;
  };

  render() {
    this.getFieldDecorator = this.props.form.getFieldDecorator;

    if (this.loading) {
      return (
        <Spin
          tip={this.props.intl.formatMessage({id: 'cubaReact.dataTable.loading'})}
          className='cuba-table-filter-loader'
        />
      );
    }

    return (
      <Form layout='inline' onSubmit={this.handleSubmit}>
        <div className='cuba-table-filter'>
          <div className='settings'>
            <div className='cuba-filter-controls-layout'>
              <Form.Item className='filtercontrol -property-caption'>
                {this.propertyCaption}
              </Form.Item>
              <Form.Item className='filtercontrol'>
                {this.getFieldDecorator(
                  `${this.props.entityProperty}_operatorsDropdown`,
                  {initialValue: this.getDefaultOperator()})(
                  <Select
                    dropdownMatchSelectWidth={false}
                    onChange={(operator: ComparisonType) => this.changeOperator(operator)}>
                    {this.operatorTypeOptions}
                  </Select>
                )}
              </Form.Item>
              {this.simpleFilterEditor}
            </div>
            {this.complexFilterEditor}
          </div>
          <Divider className='divider' />
          <div className='footer'>
            <Button htmlType='submit'
                    type='link'>
              <FormattedMessage id='cubaReact.dataTable.ok'/>
            </Button>
            <Button
              htmlType='button'
              type='link'
              onClick={this.resetFilter}>
              <FormattedMessage id='cubaReact.dataTable.reset'/>
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  getDefaultOperator(): ComparisonType {
    const propertyInfo: MetaPropertyInfo = this.propertyInfoNN;

    switch (propertyInfo.attributeType) {
      case 'ENUM':
      case 'ASSOCIATION':
      case 'COMPOSITION':
        return '=';
    }

    switch (propertyInfo.type as PropertyType) {
      case 'boolean':
        return '=';
      case 'date':
      case 'time':
      case 'dateTime':
      case 'localDate':
      case 'localTime':
      case 'localDateTime':
      case 'offsetDateTime':
      case 'offsetTime':
        return '=';
      case 'int':
      case 'double':
      case 'decimal':
      case 'long':
        return '=';
      case 'string':
        return 'contains';
      case 'uuid':
        return '=';
      default:
        throw new Error(`${this.errorContext} Unexpected property type ${propertyInfo.type} when trying to get the default condition operator`)
    }
  }

  @computed
  get operatorTypeOptions(): ReactNode {
    const propertyInfo: MetaPropertyInfo = this.propertyInfoNN;

    const availableOperators: ComparisonType[] = getAvailableOperators(propertyInfo);

    return availableOperators.map((operator: ComparisonType) => {
      return <Select.Option key={`${this.props.entityProperty}.${operator}`}
                            value={operator}>
        {this.getOperatorCaption(operator)}
      </Select.Option>;
    });
  }

  getOperatorCaption = (operator: ComparisonType): string => {
    switch (operator) {
      case '=':
      case '>':
      case '>=':
      case '<':
      case '<=':
      case '<>':
        return operator;
      case 'startsWith':
      case 'endsWith':
      case 'contains':
      case 'doesNotContain':
      case 'in':
      case 'notIn':
      case 'notEmpty':
      case 'inInterval':
        return this.props.intl.formatMessage({ id: 'cubaReact.dataTable.operator.' + operator });
      default:
        throw new Error(`${this.errorContext} Unexpected condition operator ${operator} when trying to get operator caption`);
    }
  };

  @computed
  get simpleFilterEditor(): ReactNode {
    return isComplexOperator(this.operator) ? null : this.conditionInput;
  }

  @computed
  get complexFilterEditor(): ReactNode {
    return isComplexOperator(this.operator) ? this.conditionInput : null;
  }

  cannotDetermineConditionInput(propertyType: string): string {
    return `${this.errorContext} Unexpected combination of property type ${propertyType} and condition operator ${this.operator} when trying to determine the condition input field type`;
  }

  @computed
  get conditionInput(): ReactNode {
    const propertyInfo: MetaPropertyInfo = this.propertyInfoNN;

    switch (propertyInfo.attributeType) {
      // In case of enum generic filter will not be rendered, enum filter will be rendered instead
      case 'ASSOCIATION':
      case 'COMPOSITION':
        switch (this.operator) {
          case '=':
          case '<>':
            return this.selectField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }
    }

    switch (propertyInfo.type as PropertyType) {
      case 'boolean':
        return this.yesNoSelectField;

      case 'dateTime':
      case 'localDateTime':
      case 'offsetDateTime':
        switch (this.operator) {
          case '=':
          case '<>':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return this.dateTimePickerField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
          case 'inInterval':
            return this.intervalEditor;
        }
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));

      case 'date':
      case 'localDate':
        switch (this.operator) {
          case '=':
          case '<>':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return this.datePickerField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
          case 'inInterval':
            return this.intervalEditor;
        }
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));

      case 'time':
      case 'localTime':
      case 'offsetTime':
        switch (this.operator) {
          case '=':
          case '<>':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return this.timePickerField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));

      case 'int':
      case 'double':
      case 'decimal':
      case 'long':
        switch (this.operator) {
          case '=':
          case '<>':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return this.numberInputField(propertyInfo.type as NumericPropertyType);
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));

      case 'string':
        switch (this.operator) {
          case 'contains':
          case 'doesNotContain':
          case '=':
          case '<>':
          case 'startsWith':
          case 'endsWith':
            return this.textInputField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));

      case 'uuid':
        switch (this.operator) {
          case '=':
          case '<>':
            return this.uuidInputField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }

      default:
        throw new Error(this.cannotDetermineConditionInput(propertyInfo.type));
    }
  }

  @computed
  get textInputField(): ReactNode {
    return this.createFilterInput(<Input onChange={this.onTextInputChange}/>, true);
  }

  @computed
  get uuidInputField(): ReactNode {
    const options = getDefaultFieldDecoratorOptions(this.props.intl);

    if (!options.rules) {
      options.rules = [];
    }

    options.rules.push({
      pattern: uuidPattern,
      message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.validation.uuid'})
    });

    return this.createFilterInput(<UuidInput onChange={this.onTextInputChange}/>, true, options);
  }

  numberInputField(propertyType: NumericPropertyType): ReactNode {
    switch (propertyType) {
      case 'int':
        return this.createFilterInput(<IntegerInput onChange={this.onNumberInputChange}/>, true);
      case 'double':
        return this.createFilterInput(<DoubleInput onChange={this.onNumberInputChange}/>, true);
      case 'long':
        return this.createFilterInput(<LongInput onChange={this.onNumberInputChange}/>, true);
      case 'decimal':
        return this.createFilterInput(<BigDecimalInput onChange={this.onNumberInputChange}/>, true);
      default:
        return assertNever('property type', propertyType);
    }
  }

  @computed
  get selectField(): ReactNode {
    return this.createFilterInput(
      <Select dropdownMatchSelectWidth={false}
              className='cuba-filter-select'
              onSelect={this.onSelectChange}>
        {this.selectFieldOptions}
      </Select>
    );
  }

  @computed
  get selectFieldOptions(): ReactNode {
    return this.nestedEntityOptions.map((option) => {
      return (
        <Select.Option title={option.caption} value={option.value} key={option.value}>
          {option.caption}
        </Select.Option>
      );
    })
  }

  @computed
  get yesNoSelectField(): ReactNode {
    const component = (
      <Select dropdownMatchSelectWidth={false}
              className='cuba-filter-select'
              onSelect={this.onYesNoSelectChange}>
        <Select.Option value='true'>
          <FormattedMessage id='cubaReact.dataTable.yes'/>
        </Select.Option>
        <Select.Option value='false'>
          <FormattedMessage id='cubaReact.dataTable.no'/>
        </Select.Option>
      </Select>
    );

    return this.createFilterInput(component, false, {initialValue: 'true', rules: [{required: true}]});
  }

  @computed
  get listEditor(): ReactNode {
    return (
      <Form.Item className='filtercontrol -complex-editor'>
        <DataTableListEditor onChange={(value: string[] | number[]) => this.value = value}
                             id={this.props.entityProperty}
                             propertyInfo={this.propertyInfoNN}
                             getFieldDecorator={this.props.form.getFieldDecorator}
                             nestedEntityOptions={this.nestedEntityOptions}
        />
      </Form.Item>
    );
  }

  @computed
  get intervalEditor(): ReactNode {
    return (
      <Form.Item className='filtercontrol -complex-editor'>
        <DataTableIntervalEditor onChange={(value: TemporalInterval) => this.value = value}
                                 id={this.props.entityProperty}
                                 getFieldDecorator={this.props.form.getFieldDecorator}
                                 propertyType={this.propertyInfoNN.type as PropertyType}
        />
      </Form.Item>
    );
  };

  @computed
  get datePickerField(): ReactNode {
    const component = (
      <DatePicker placeholder='YYYY-MM-DD' onChange={this.onDatePickerChange}/>
    );
    return this.createFilterInput(component, true);
  }

  @computed
  get timePickerField(): ReactNode {
    const component = (
      <TimePicker placeholder='HH:mm:ss'
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                  onChange={this.onTimePickerChange}/>
    );
    return this.createFilterInput(component, true);
  }

  @computed
  get dateTimePickerField(): ReactNode {
    const datePicker = (
      <DatePicker placeholder='YYYY-MM-DD'/>
    );
    const filterDatePicker = this.createFilterInput(datePicker, true);

    const timePicker = (
      <TimePicker placeholder='HH:mm:ss'
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                  onChange={this.onDateTimePickerChange}/>
    );
    const filterTimePicker = this.createFilterInput(timePicker, true);

    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        <div className='cuba-filter-controls-layout'>
          {filterDatePicker}
          {filterTimePicker}
        </div>
      </Form.Item>
    );
  }

  createFilterInput(
    component: ReactNode, hasFeedback: boolean = false, options?: GetFieldDecoratorOptions, additionalClassName?: string
  ): ReactNode {
    return decorateAndWrapInFormItem(
      component, this.props.entityProperty, this.getFieldDecorator, this.props.intl, hasFeedback, options, additionalClassName
    );
  }

}

function determineOperatorGroup(operator: ComparisonType): OperatorGroup {
  switch (operator) {
    case '=':
    case '>':
    case '>=':
    case '<':
    case '<=':
    case '<>':
    case 'startsWith':
    case 'endsWith':
    case 'contains':
    case 'doesNotContain':
      return OperatorGroup.SINGLE_VALUE;
    case 'in':
    case 'notIn':
      return OperatorGroup.LIST_VALUE;
    case 'notEmpty':
      return OperatorGroup.LOGICAL_VALUE;
    case 'inInterval':
      return OperatorGroup.INTERVAL_VALUE;
    default:
      throw new Error(`Could not determine condition operator group: unexpected operator ${operator}`);
  }
}

function getAvailableOperators(propertyInfo: MetaPropertyInfo): ComparisonType[] {
  switch (propertyInfo.attributeType) {
    case 'ENUM':
    case 'ASSOCIATION':
    case 'COMPOSITION':
      return ['=', '<>', 'in', 'notIn', 'notEmpty'];
  }

  switch (propertyInfo.type as PropertyType) {
    case 'boolean':
      return ['=', '<>', 'notEmpty'];
    case 'date':
    case 'localDate':
    case 'dateTime':
    case 'localDateTime':
    case 'offsetDateTime':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty', 'inInterval'];
    case 'time':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty'];
    case 'localTime':
    case 'offsetTime':
      // 'in', 'notIn' are not supported, see https://github.com/cuba-platform/restapi/issues/93
      return ['=', '<>', '>', '>=', '<', '<=', 'notEmpty'];
    case 'int':
    case 'double':
    case 'long':
    case 'decimal':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty'];
    case 'string':
      return ['contains', '=', 'in', 'notIn', '<>', 'doesNotContain', 'notEmpty', 'startsWith', 'endsWith'];
    case 'uuid':
      return ['=', 'in', 'notIn', '<>', 'notEmpty'];
    default:
      throw new Error(`Could not determine available condition operators for property ${propertyInfo.name} with attribute type ${propertyInfo.attributeType} and type ${propertyInfo.type}`);
  }
}

function isComplexOperator(operator: ComparisonType): boolean {
  const complexOperators: string[] = ['in', 'notIn', 'inInterval'];
  return complexOperators.indexOf(operator) > -1;
}

const dataTableCustomFilter =
  Form.create<DataTableCustomFilterProps>()(
    injectIntl(
      DataTableCustomFilterComponent
    )
  );

export {dataTableCustomFilter as DataTableCustomFilter};
