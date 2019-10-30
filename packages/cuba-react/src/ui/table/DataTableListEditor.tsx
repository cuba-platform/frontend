import * as React from "react";
import {action, observable, computed} from "mobx";
import {DatePicker, Form, Icon, Input, InputNumber, Select, Tag, TimePicker, Tooltip} from "antd";
import {observer} from "mobx-react";
import moment, {Moment} from "moment";
import {CaptionValuePair} from "./DataTableCustomFilter";
import {DataTableListEditorDateTimePicker} from './DataTableListEditorDateTimePicker';
import {MetaPropertyInfo, PropertyType} from '@cuba-platform/rest';
import {ReactNode} from 'react';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import {LabeledValue} from 'antd/es/select';
import {FormattedMessage} from 'react-intl';

interface DataTableListEditorProps {
  onChange: (items: any) => void,
  id: string,
  propertyInfo: MetaPropertyInfo,
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode,
  nestedEntityOptions: CaptionValuePair[]
}

export enum DataTableListEditorType {
  TEXT = 'text',
  NUMBER = 'number',
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
          return DataTableListEditorType.TEXT;
        case 'int':
        case 'double':
        case 'decimal':
          return DataTableListEditorType.NUMBER;
        case 'date':
          return DataTableListEditorType.DATE;
        case 'time':
          return DataTableListEditorType.TIME;
        case 'dateTime':
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
    this.props.onChange(this.items.map((savedItem) => savedItem.value));
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
  onDatePickerChange = (_date: Moment | null, dateString: string): void => {
    this.handleInputChange(dateString);
    this.handleInputConfirm()
  };

  @action
  onTimePickerChange = (time: Moment, _timeString: string): void => {
    if (time) {
      const timeParam = time.format('HH:mm:ss');
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
    this.handleInputChange(value, caption);
    this.availableOptions = this.availableOptions.filter((option) => {
      return option.value !== value;
    });
    this.handleInputConfirm();
  };

  @action
  handleInputChange = (value: any, caption: any = value): void => {
    this.inputModel.value = value;
    this.inputModel.caption = caption;
  };

  @action
  handleInputConfirm = (): void => {
    if (this.inputModel
        && this.inputModel.value
        && this.items.findIndex((item => item.value === this.inputModel.value)) === -1) {
      this.items = [...this.items, { ...this.inputModel }];
      this.inputModel.value = undefined;
      this.inputModel.caption = '';
      this.inputVisible = false;
      this.props.onChange(this.items.map((item) => item.value));
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
            return item.value
              ? <ListItemTag item={item} onClose={this.handleClose} key={item.value}/>
              : null;
          })
        }
        {this.inputVisible && (
          <Form.Item className={'data-table-custom-filter-form-item'}>
            {this.input}
          </Form.Item>
        )}
        {!this.inputVisible && (
          <Tag onClick={this.showInput}
             color='blue'
             style={{ borderStyle: 'dashed' }}>
            <Icon type="plus" />
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
      case DataTableListEditorType.NUMBER:
        // @ts-ignore
        return (<div><InputNumber
              ref={this.trapFocus}
              type='text'
              size='small'
              value={this.inputModel.value as number | undefined}
              onChange={this.handleInputChange}
              onBlur={this.onInputBlurOrEnter}
              onPressEnter={this.onInputBlurOrEnter}
            />
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
          />
        );
      case DataTableListEditorType.SELECT:
        return (
          <div>
            <Select dropdownMatchSelectWidth={false}
                style={{ minWidth: '60px' }}
                onSelect={this.onSelect}>
              {this.selectFieldOptions}
            </Select>
          </div>
        );
      default:
        throw new Error(`Unexpected ListEditorType ${this.type}`);
    }
  }

  @computed
  get selectFieldOptions(): ReactNode {
    return this.availableOptions.map((option) => {
      return (
        <Select.Option title={option.caption} value={option.value} key={option.value}>
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
