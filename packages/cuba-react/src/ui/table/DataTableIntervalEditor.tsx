import {observer} from 'mobx-react';
import React, {ReactNode} from 'react';
import {action, computed, observable} from 'mobx';
import {Checkbox, Form, InputNumber, Radio, Select} from 'antd';
import {RadioChangeEvent} from 'antd/es/radio';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {determineLastNextXInterval, determinePredefinedInterval} from './DataTableIntervalFunctions';
import './DataTableCustomFilter.css';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';

export interface Interval {
  minDate: string,
  maxDate: string,
}

interface DataTableIntervalEditorProps {
  onChange: (value: any) => void,
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode,
  id: string,
}

export type DataTableIntervalEditorMode = 'last' | 'next' | 'predefined';
export type TimeUnit = 'days' | 'hours' | 'minutes' | 'months';
export type PredefinedIntervalOption = 'today' | 'yesterday' | 'tomorrow' | 'lastMonth' | 'thisMonth' | 'nextMonth';

// TODO i18n

@observer
export class DataTableIntervalEditor extends React.Component<DataTableIntervalEditorProps> {

  @observable mode: DataTableIntervalEditorMode = 'last';
  @observable option: PredefinedIntervalOption = 'today';
  @observable numberOfUnits: number = 5;
  @observable timeUnit: TimeUnit = 'days';
  @observable includeCurrent: boolean = false;

  componentDidMount(): void {
    this.props.onChange(this.interval);
  }

  @computed
  get interval(): Interval {
    return (this.mode === 'predefined')
      ? determinePredefinedInterval(this.option)
      : determineLastNextXInterval(this.mode, this.numberOfUnits, this.timeUnit, this.includeCurrent);
  }

  @action
  onModeChanged = (e: RadioChangeEvent) => {
    this.mode = e.target.value;
    this.props.onChange(this.interval);
  };

  @action
  onPredefinedIntervalOptionChanged = (option: PredefinedIntervalOption) => {
    this.option = option;
    this.props.onChange(this.interval);
  };

  @action
  onIntervalNumberChanged = (value: number | undefined) => {
    if (value) {
      this.numberOfUnits = value;
      this.props.onChange(this.interval);
    }
  };

  @action
  onIntervalUnitChanged = (unit: TimeUnit) => {
    this.timeUnit = unit;
    this.props.onChange(this.interval);
  };

  @action
  onIncludeCurrentChanged = (includeCurrent: CheckboxChangeEvent) => {
    this.includeCurrent = includeCurrent.target.checked;
    this.props.onChange(this.interval);
  };

  render() {
    return (
      <div className={'data-table-custom-filter-form-item-group'}
           style={{padding: '6px', marginTop: '6px', border: 'dotted 1px lightgray'}}>
        {this.modeSelect}
        {(this.mode === 'predefined') ? this.predefinedIntervals : this.intervalInput}
      </div>
    );
  }

  @computed
  get modeSelect(): ReactNode {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}} className={'data-table-custom-filter-form-item'}>
        <Radio.Group onChange={this.onModeChanged}
                    value={this.mode}>
          <Radio style={{display: 'block'}} value={'last'}>Last</Radio>
          <Radio style={{display: 'block'}} value={'next'}>Next</Radio>
          <Radio style={{display: 'block'}} value={'predefined'}>Predefined</Radio>
        </Radio.Group>
      </div>
    );
  }

  @computed
  get predefinedIntervals(): ReactNode {
    return (
      <Form.Item className={'data-table-custom-filter-form-item'}>
        {this.props.getFieldDecorator(`${this.props.id}.predefined`, {
          initialValue: this.option,
          rules: [{required: true, message: 'Required field'}],
        })(
          <Select onChange={this.onPredefinedIntervalOptionChanged}
                  dropdownMatchSelectWidth={false}
                  style={{minWidth: '100px'}}>
            <Select.Option value={'today'}>Today</Select.Option>
            <Select.Option value={'yesterday'}>Yesterday</Select.Option>
            <Select.Option value={'tomorrow'}>Tomorrow</Select.Option>
            <Select.Option value={'lastMonth'}>Last month</Select.Option>
            <Select.Option value={'thisMonth'}>This month</Select.Option>
            <Select.Option value={'nextMonth'}>Next month</Select.Option>
          </Select>
        )}
      </Form.Item>
    );
  };

  @computed
  get intervalInput(): ReactNode {
    return (
      <div className={'data-table-custom-filter-form-item-group'}>
        <Form.Item key={`${this.props.id}.wrap.number`} className={'data-table-custom-filter-form-item'}>
          {this.props.getFieldDecorator(`${this.props.id}.number`, {
            initialValue: this.numberOfUnits,
            rules: [{required: true, message: 'Required field'}],
          })(
            <InputNumber onChange={this.onIntervalNumberChanged}/>
          )}
        </Form.Item>
        <Form.Item key={`${this.props.id}.wrap.unit`} className={'data-table-custom-filter-form-item'}>
          <Select defaultValue={this.timeUnit}
                  onChange={this.onIntervalUnitChanged}
                  dropdownMatchSelectWidth={false}>
            <Select.Option value={'days'}>Days</Select.Option>
            <Select.Option value={'hours'}>Hours</Select.Option>
            <Select.Option value={'minutes'}>Minutes</Select.Option>
            <Select.Option value={'months'}>Months</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item key={`${this.props.id}.wrap.includeCurrent`} className={'data-table-custom-filter-form-item'}>
          <Checkbox onChange={this.onIncludeCurrentChanged}
                    style={{whiteSpace: 'nowrap'}}
                    defaultChecked={this.includeCurrent}>
            including current
          </Checkbox>
        </Form.Item>
      </div>
    );
  };

}
