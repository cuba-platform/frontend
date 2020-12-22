import {observer} from 'mobx-react';
import React, {ReactNode} from 'react';
import {action, computed, observable} from 'mobx';
import { Form } from 'antd';
import { Checkbox, InputNumber, Radio, Select } from 'antd';
import {RadioChangeEvent} from 'antd/es/radio';
import {CheckboxChangeEvent} from 'antd/es/checkbox';
import {determineLastNextXInterval, determinePredefinedInterval} from './DataTableIntervalFunctions';
import './DataTableIntervalEditor.less';
import './DataTableFilterControlLayout.less';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {PropertyType} from '@haulmont/jmix-rest';

export interface TemporalInterval {
  minDate: string,
  maxDate: string,
}

interface DataTableIntervalEditorProps {
  onChange: (value: TemporalInterval) => void,
  id: string,
  propertyType: PropertyType
}

export type DataTableIntervalEditorMode = 'last' | 'next' | 'predefined';
export type TimeUnit = 'days' | 'hours' | 'minutes' | 'months';
export type PredefinedIntervalOption = 'today' | 'yesterday' | 'tomorrow' | 'lastMonth' | 'thisMonth' | 'nextMonth';

@observer
class DataTableIntervalEditorComponent extends React.Component<DataTableIntervalEditorProps & WrappedComponentProps> {

  @observable mode: DataTableIntervalEditorMode = 'last';
  @observable option: PredefinedIntervalOption = 'today';
  @observable numberOfUnits: number = 5;
  @observable timeUnit: TimeUnit = 'days';
  @observable includeCurrent: boolean = false;

  componentDidMount(): void {
    this.props.onChange(this.interval);
  }

  @computed
  get interval(): TemporalInterval {
    return (this.mode === 'predefined')
      ? determinePredefinedInterval(this.option, this.props.propertyType)
      : determineLastNextXInterval(this.mode, this.numberOfUnits, this.timeUnit, this.includeCurrent, this.props.propertyType);
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
  onIntervalNumberChanged = (value: string | number | undefined) => {
    if (value != null && typeof value === 'number' && isFinite(value)) {
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
      <div className='cuba-filter-controls-layout cuba-table-filter-interval'>
        {this.modeSelect}
        {(this.mode === 'predefined') ? this.predefinedIntervals : this.intervalInput}
      </div>
    );
  }

  @computed
  get modeSelect(): ReactNode {
    return (
      <Radio.Group
          className='cuba-interval-mode-select'
          onChange={this.onModeChanged}
          value={this.mode}>
        <Radio value={'last'}>
          <FormattedMessage id='cubaReact.dataTable.intervalEditor.last'/>
        </Radio>
        <Radio value={'next'}>
          <FormattedMessage id='cubaReact.dataTable.intervalEditor.next'/>
        </Radio>
        <Radio value={'predefined'}>
          <FormattedMessage id='cubaReact.dataTable.intervalEditor.predefined'/>
        </Radio>
      </Radio.Group>
    );
  }

  @computed
  get predefinedIntervals(): ReactNode {
    return (
      <Form.Item className='filtercontrol'
                 name={`${this.props.id}_predefined`}
                 initialValue={this.option}
                 rules={[{
                   required: true,
                   message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.validation.requiredField'})
                 }]}
      >
        <Select onChange={this.onPredefinedIntervalOptionChanged}
                dropdownMatchSelectWidth={false}
                className='cuba-interval-predefined-select'
        >
          <Select.Option value={'today'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.today' />
          </Select.Option>
          <Select.Option value={'yesterday'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.yesterday' />
          </Select.Option>
          <Select.Option value={'tomorrow'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.tomorrow' />
          </Select.Option>
          <Select.Option value={'lastMonth'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.lastMonth' />
          </Select.Option>
          <Select.Option value={'thisMonth'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.thisMonth' />
          </Select.Option>
          <Select.Option value={'nextMonth'}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.nextMonth' />
          </Select.Option>
        </Select>
      </Form.Item>
    );
  };

  @computed
  get intervalInput(): ReactNode {
    return (
      <div className='cuba-filter-controls-layout'>
        <Form.Item key={`${this.props.id}.wrap.number`}
                   className='filtercontrol'
                   name={`${this.props.id}_number`}
                   initialValue={this.numberOfUnits}
                   rules={[{
                     required: true,
                     message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.validation.requiredField'})
                   }]}
        >
          <InputNumber onChange={this.onIntervalNumberChanged}/>
        </Form.Item>
        <Form.Item key={`${this.props.id}.wrap.unit`} className='filtercontrol'>
          <Select defaultValue={this.timeUnit}
                  onChange={this.onIntervalUnitChanged}
                  dropdownMatchSelectWidth={false}>
            <Select.Option value={'days'}>
              <FormattedMessage id='cubaReact.dataTable.intervalEditor.days' />
            </Select.Option>
            <Select.Option value={'hours'}>
              <FormattedMessage id='cubaReact.dataTable.intervalEditor.hours' />
            </Select.Option>
            <Select.Option value={'minutes'}>
              <FormattedMessage id='cubaReact.dataTable.intervalEditor.minutes' />
            </Select.Option>
            <Select.Option value={'months'}>
              <FormattedMessage id='cubaReact.dataTable.intervalEditor.months' />
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item key={`${this.props.id}.wrap.includeCurrent`} className='filtercontrol'>
          <Checkbox onChange={this.onIncludeCurrentChanged}
                    className='cuba-interval-include-current'
                    defaultChecked={this.includeCurrent}>
            <FormattedMessage id='cubaReact.dataTable.intervalEditor.includingCurrent' />
          </Checkbox>
        </Form.Item>
      </div>
    );
  };

}

const dataTableIntervalEditor =
    injectIntl(
      DataTableIntervalEditorComponent
    );

export { dataTableIntervalEditor as DataTableIntervalEditor };
