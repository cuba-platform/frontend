import * as React from "react";
import {action, observable, computed} from "mobx";
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import { DatePicker, Input, Select, Tag, TimePicker, Tooltip, InputNumber } from "antd";
import {observer} from "mobx-react";
import moment, {Moment} from "moment";
import {CaptionValuePair} from "./DataTableCustomFilter";
import {DataTableListEditorDateTimePicker} from './DataTableListEditorDateTimePicker';
import {MetaPropertyInfo, PropertyType} from '@cuba-platform/rest';
import {ReactNode, Ref} from 'react';
import { GetFieldDecoratorOptions } from '@ant-design/compatible/es/form/Form';
import {FormattedMessage} from 'react-intl';
import {IntegerInput} from '../form/IntegerInput';
import {DoubleInput} from '../form/DoubleInput';
import {LongInput} from '../form/LongInput';
import {BigDecimalInput} from '../form/BigDecimalInput';
import {assertNever, getDataTransferFormat} from '@cuba-platform/react-core';
import {InputNumberProps} from 'antd/es/input-number';
import {LabeledValue} from 'antd/es/select';

interface DataTableListEditorProps {
  onChange: (items: string[] | number []) => void,
  id: string,
  propertyInfo: MetaPropertyInfo,
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode,
  nestedEntityOptions: CaptionValuePair[]
}

export enum DataTableListEditorType {
  TEXT = 'text',
  INTEGER = 'integer',
  DOUBLE = 'double',
  LONG = 'long',
  BIG_DECIMAL = 'bigDecimal',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  SELECT = 'select',
}

@observer
export class DataTableListEditor extends React.Component<DataTableListEditorProps> {

  @observable inputVisible = false;
  @observable inputModel: CaptionValuePair = {
    caption: '',
    value: undefined,
  };
  @observable items: CaptionValuePair[] = [];
  @observable availableOptions!: CaptionValuePair[];

  @computed
  get type(): DataTableListEditorType {
    if (this.props.propertyInfo.attributeType === 'ASSOCIATION' || this.props.propertyInfo.attributeType === 'COMPOSITION') {
      return DataTableListEditorType.SELECT;
    } else {
      switch(this.props.propertyInfo.type as PropertyType) {
        case 'string':
        case 'uuid':
          return DataTableListEditorType.TEXT;
        case 'int':
          return DataTableListEditorType.INTEGER;
        case 'double':
          return DataTableListEditorType.DOUBLE;
        case 'long':
          return DataTableListEditorType.LONG;
        case 'decimal':
          return DataTableListEditorType.BIG_DECIMAL;
        case 'date':
        case 'localDate':
          return DataTableListEditorType.DATE;
        case 'time':
        case 'localTime':
        case 'offsetTime':
          return DataTableListEditorType.TIME;
        case 'dateTime':
        case 'localDateTime':
        case 'offsetDateTime':
          return DataTableListEditorType.DATETIME;
        default:
          throw new Error(`Unexpected property type ${this.props.propertyInfo.type}`);
      }
    }
  }

  // tslint:disable-next-line:ban-types
  getFieldDecorator!: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode;

  componentDidMount(): void {
    this.availableOptions = [ ...this.props.nestedEntityOptions ];
    this.getFieldDecorator = this.props.getFieldDecorator;
  }

  @action
  handleClose = (item: CaptionValuePair): void => {
    this.items = this.items.filter(savedItem => savedItem !== item);
    if (this.type === DataTableListEditorType.SELECT) {
      this.availableOptions = [ ...this.availableOptions, item ];
    }
    this.props.onChange(this.items.map((savedItem) => savedItem.value) as string[] | number[]);
  };

  @action
  onTextInputChange = (event: any): void => {
    this.handleInputChange(event.target.value);
  };

  @action
  onInputBlurOrEnter = (event: any): void => {
    event.preventDefault();
    this.handleInputConfirm();
  };

  @action
  onDatePickerChange = (date: Moment | null, _dateString: string): void => {
    if (date) {
      this.handleInputChange(date.format(getDataTransferFormat(this.props.propertyInfo.type as PropertyType)));
      this.handleInputConfirm()
    }
  };

  @action
  onTimePickerChange = (time: Moment | null, _timeString: string): void => {
    if (time != null) {
      const timeParam = time.format(getDataTransferFormat(this.props.propertyInfo.type as PropertyType));
      this.handleInputChange(timeParam);
    }
  };

  @action
  onTimePickerOpenChange = (open: boolean): void => {
    if (!open && this.inputModel) {
      this.handleInputConfirm();
    }
  };

  @action
  onSelect = (value: string | number | LabeledValue): void => {
    const caption: string = this.props.nestedEntityOptions
      .find((option) => option.value === value)!
      .caption;
    this.handleInputChange(value as string, caption);
    this.availableOptions = this.availableOptions.filter((option) => {
      return option.value !== value;
    });
    this.handleInputConfirm();
  };

  @action
  handleInputChange = (value: string, caption: string = value): void => {
    this.inputModel.value = value;
    this.inputModel.caption = caption;
  };

  @action
  handleInputNumberChange = (value: string | number | undefined): void => {
    if (value != null) {
      this.inputModel.value = value;
      this.inputModel.caption = String(value);
    }
  };

  @action
  handleInputConfirm = (): void => {
    if (this.inputModel
        && this.inputModel.value != null
        && this.items.findIndex((item => item.value === this.inputModel.value)) === -1) {
      this.items = [...this.items, { ...this.inputModel }];
      this.inputModel.value = undefined;
      this.inputModel.caption = '';
      this.inputVisible = false;
      this.props.onChange(this.items.map((item) => item.value) as string[] | number[]);
    }
  };

  @action
  showInput = (): void => {
    this.inputVisible = true;
  };

  render() {
    return (
      <div>
        {
          this.items.map((item: CaptionValuePair) => {
            return item.value != null
              ? <ListItemTag item={item} onClose={this.handleClose} key={item.value}/>
              : null;
          })
        }
        {this.inputVisible && (
          <Form.Item className='filtercontrol'>
            {this.input}
          </Form.Item>
        )}
        {!this.inputVisible && (
          <Tag onClick={this.showInput}
             color='blue'
             className='cuba-list-editor-input'
          >
            <PlusOutlined />
            &nbsp;
            <FormattedMessage id='cubaReact.dataTable.listEditor.addItem'/>
          </Tag>
        )}
      </div>
    );
  }

  trapFocus = (input: any): void => {
    if (input) {
      input.focus();
    }
  };

  @computed
  get input(): ReactNode {
    switch (this.type) {
      case DataTableListEditorType.TEXT:
        return (
          <div>
            <Input
              ref={this.trapFocus}
              type='text'
              size='small'
              v-model={this.inputModel.value}
              onChange={this.onTextInputChange}
              onBlur={this.onInputBlurOrEnter}
              onPressEnter={this.onInputBlurOrEnter}
            />
          </div>
        );
      case DataTableListEditorType.INTEGER:
        return (
          <div>
            <IntegerInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.DOUBLE:
        return (
          <div>
            <DoubleInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.LONG:
        return (
          <div>
            <LongInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.BIG_DECIMAL:
        return (
          <div>
            <BigDecimalInput {...this.getInputNumberProps()} />
          </div>
        );
      case DataTableListEditorType.DATE:
        return (
          <div>
            <DatePicker
              placeholder='YYYY-MM-DD'
              onChange={this.onDatePickerChange}
            />
          </div>
        );
      case DataTableListEditorType.TIME:
        return (
          <div>
            <TimePicker placeholder='HH:mm:ss'
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                  onChange={this.onTimePickerChange}
                  onOpenChange={this.onTimePickerOpenChange}
            />
          </div>
        );
      case DataTableListEditorType.DATETIME:
        return (
          <DataTableListEditorDateTimePicker getFieldDecorator={this.getFieldDecorator}
                                             id={this.props.id}
                                             onInputChange={this.handleInputChange}
                                             onInputConfirm={this.handleInputConfirm}
                                             propertyType={this.props.propertyInfo.type as PropertyType}
          />
        );
      case DataTableListEditorType.SELECT:
        return (
          <div>
            <Select dropdownMatchSelectWidth={false}
                    dropdownClassName={`cuba-value-dropdown-${this.props.id}`}
                    className='cuba-filter-select'
                    onSelect={this.onSelect}>
              {this.selectFieldOptions}
            </Select>
          </div>
        );
      default:
        return assertNever('ListEditorType', this.type);
    }
  }

  getInputNumberProps(): InputNumberProps & {ref: Ref<typeof InputNumber>} {
    return {
      ref: this.trapFocus,
      type: 'text',
      size: 'small',
      value: this.inputModel.value as number | undefined,
      onChange: this.handleInputNumberChange,
      onBlur: this.onInputBlurOrEnter,
      onPressEnter: this.onInputBlurOrEnter,
    };
  }

  @computed
  get selectFieldOptions(): ReactNode {
    return this.availableOptions
      .filter(option => option.value != null)
      .map((option) => {
      return (
        <Select.Option title={option.caption}
                       value={option.value!}
                       key={option.value}
                       className={`cuba-filter-value-${option.value}`}
        >
          {option.caption}
        </Select.Option>
      );
    })
  }
}

interface ListItemTagProps {
  item: CaptionValuePair;
  onClose: (item: CaptionValuePair) => void;
}

function ListItemTag(props: ListItemTagProps) {
  const { item, onClose } = props;
  const isLong = item.caption.length > 20;
  const tag = (
    <Tag closable={true}
         onClose={() => onClose(item)}>
      {isLong ? `${item.caption.substr(0, 20)}...` : item.caption}
    </Tag>
  );

  return isLong ? (
    <Tooltip title={item.caption}>
      {tag}
    </Tooltip>
  ) : (
    tag
  );
}
