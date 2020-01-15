import React, {FormEvent, ReactNode} from 'react';
import {Button, DatePicker, Divider, Form, Input, InputNumber, message, Select, Spin, TimePicker} from 'antd';
import {FormComponentProps} from 'antd/es/form';
import {FilterDropdownProps} from 'antd/es/table';
import {observer} from 'mobx-react';
import {MetaClassInfo, MetaPropertyInfo, OperatorType, PropertyType} from '@cuba-platform/rest';
import {action, computed, observable} from 'mobx';
import moment, {Moment} from 'moment';
import {DataTableListEditor} from './DataTableListEditor';
import {DataTableIntervalEditor} from './DataTableIntervalEditor';
import './DataTableCustomFilter.less';
import './DataTableFilterControlLayout.less';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import {injectIntl, WrappedComponentProps, FormattedMessage} from 'react-intl';
import {MainStoreInjected, injectMainStore, WithId, getCubaREST, getPropertyInfo} from "@cuba-platform/react-core";

export interface CaptionValuePair {
  caption: string;
  value: string | number | undefined;
}

export interface DataTableCustomFilterProps extends FormComponentProps, MainStoreInjected {
  entityName: string,
  entityProperty: string,
  filterProps: FilterDropdownProps,
  operator: ComparisonType | undefined,
  onOperatorChange: (operator: ComparisonType, propertyName: string) => void,
  value: any,
  onValueChange: (value: any, propertyName: string) => void,
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

  set value(value: any) {
    this.props.onValueChange(value, this.props.entityProperty);
  }

  get value(): any {
    return this.props.value;
  }

  constructor(props: DataTableCustomFilterProps & WrappedComponentProps) {
    super(props);

    this.setDefaultYesNoDropdown();
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
                caption: instance._instanceName,
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

  @computed get propertyCaption(): string {
    return this.props.mainStore!.messages![this.props.entityName + '.' + this.props.entityProperty];
  }

  @computed get propertyInfoNN(): MetaPropertyInfo {
    const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
      this.props.mainStore!.metadata!,
      this.props.entityName,
      this.props.entityProperty);

    if (!propertyInfo) {
      throw new Error('Cannot find MetaPropertyInfo for property ' + this.props.entityProperty);
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

  @action
  resetFilter = (): void => {
    if (this.propertyInfoNN.type === 'boolean') {
      this.value = 'true';
    } else {
      this.value = null;
    }

    this.props.form.resetFields();
    this.operator = this.getDefaultOperator();

    // @ts-ignore
    this.props.filterProps.clearFilters!(this.props.filterProps.selectedKeys!);
  };

  @action
  changeOperator = (newOperator: ComparisonType): void => {
    const oldOperator: ComparisonType = this.operator;

    const oldOperatorGroup: OperatorGroup = determineOperatorGroup(oldOperator);
    const newOperatorGroup: OperatorGroup = determineOperatorGroup(newOperator);

    if (oldOperatorGroup !== newOperatorGroup) {
      this.props.form.resetFields();
      this.value = null;
    }

    this.operator = newOperator;

    this.setDefaultYesNoDropdown();
  };

  @action
  setDefaultYesNoDropdown = (): void => {
    if (!this.value &&
      (this.operator === 'notEmpty' || this.propertyInfoNN.type === 'boolean')
    ) {
      this.value = 'true';
    }
  };

  @action
  onTextInputChange = (event: any): void => {
    this.value = event.target.value;
  };

  @action
  onDatePickerChange = (_date: Moment | null, dateString: string): void => {
    this.value = dateString;
  };

  @action
  onTimePickerChange = (time: Moment | null, _timeString: string): void => {
    if (time) {
      this.value = time.format('HH:mm:ss.mmm');
    }
  };

  @action
  onDateTimePickerChange = (dateTime: Moment, _timeString: string): void => {
    if (dateTime) {
      this.value = dateTime.format('YYYY-MM-DD HH:mm:ss.000');
    }
  };

  @action
  setValue = (value: any): void => {
    this.value = value;
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
                  `${this.props.entityProperty}.operatorsDropdown`,
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
        return '=';
      case 'int':
      case 'double':
      case 'decimal':
        return '=';
      case 'string':
        return 'contains';
      default:
        throw new Error(`Unexpected property type ${propertyInfo.type}`)
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
        throw new Error(`Unexpected ComparisonType ${operator}`);
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
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);

      case 'date':
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
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);

      case 'time':
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
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);

      case 'int':
      case 'double':
      case 'decimal':
        switch (this.operator) {
          case '=':
          case '<>':
          case '>':
          case '>=':
          case '<':
          case '<=':
            return this.numberInputField;
          case 'in':
          case 'notIn':
            return this.listEditor;
          case 'notEmpty':
            return this.yesNoSelectField;
        }
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);

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
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);

      default:
        throw new Error(`Unexpected combination of property type ${propertyInfo.type} and condition operator ${this.operator}`);
    }
  }

  @computed
  get textInputField(): ReactNode {
    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
          <Input onChange={this.onTextInputChange}/>
        )}
      </Form.Item>
    );
  }

  @computed
  get numberInputField(): ReactNode {
    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
          <InputNumber onChange={this.setValue}/>
        )}
      </Form.Item>
    );
  }

  @computed
  get selectField(): ReactNode {
    return (
      <Form.Item className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, {initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}]})(
          <Select dropdownMatchSelectWidth={false}
              className='cuba-filter-select'
              onSelect={this.setValue}>
            {this.selectFieldOptions}
          </Select>
        )}
      </Form.Item>
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
    return (
      <Form.Item className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, {initialValue: 'true', rules: [{required: true}]})(
          <Select dropdownMatchSelectWidth={false}
                  className='cuba-filter-select'
                  onSelect={this.setValue}>
            <Select.Option value='true'>
              <FormattedMessage id='cubaReact.dataTable.yes'/>
            </Select.Option>
            <Select.Option value='false'>
              <FormattedMessage id='cubaReact.dataTable.no'/>
            </Select.Option>
          </Select>
        )}
      </Form.Item>
    );
  }

  @computed
  get listEditor(): ReactNode {
    return (
      <Form.Item className='filtercontrol -complex-editor'>
        <DataTableListEditor onChange={(value: any) => this.value = value}
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
        <DataTableIntervalEditor onChange={(value: any) => this.value = value}
                                 id={this.props.entityProperty}
                                 getFieldDecorator={this.props.form.getFieldDecorator}
        />
      </Form.Item>
    );
  };

  @computed
  get datePickerField(): ReactNode {
    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
          <DatePicker placeholder='YYYY-MM-DD' onChange={this.onDatePickerChange}/>
        )}
      </Form.Item>
    );
  }

  @computed
  get timePickerField(): ReactNode {
    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
          <TimePicker placeholder='HH:mm:ss'
                defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                onChange={this.onTimePickerChange}/>
        )}
      </Form.Item>
    );
  }

  @computed
  get dateTimePickerField(): ReactNode {
    return (
      <Form.Item hasFeedback={true} className='filtercontrol'>
        <div className='cuba-filter-controls-layout'>
          <Form.Item hasFeedback={true} className='filtercontrol'>
            {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
              <DatePicker placeholder='YYYY-MM-DD'/>
            )}
          </Form.Item>
          <Form.Item hasFeedback={true} className='filtercontrol'>
            {this.getFieldDecorator(`${this.props.entityProperty}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
              <TimePicker placeholder='HH:mm:ss'
                    defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                    onChange={this.onDateTimePickerChange}/>
            )}
          </Form.Item>
        </div>
      </Form.Item>
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
      throw new Error(`Unexpected ComparisonType ${operator}`);
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
    case 'dateTime':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty', 'inInterval'];
    case 'time':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty'];
    case 'int':
    case 'double':
    case 'decimal':
      return ['=', 'in', 'notIn', '<>', '>', '>=', '<', '<=', 'notEmpty'];
    case 'string':
      return ['contains', '=', 'in', 'notIn', '<>', 'doesNotContain', 'notEmpty', 'startsWith', 'endsWith'];
    default:
      throw new Error(`Unexpected property type ${propertyInfo.type}`)
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
