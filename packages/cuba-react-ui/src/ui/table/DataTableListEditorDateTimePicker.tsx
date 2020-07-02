import { Form } from '@ant-design/compatible';
import { GetFieldDecoratorOptions } from '@ant-design/compatible/es/form/Form';
import { Button, DatePicker, TimePicker } from 'antd';
import moment, {Moment} from 'moment';
import * as React from 'react';
import {action, observable} from 'mobx';
import {ReactNode} from 'react';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {getDataTransferFormat, getDisplayFormat} from '@cuba-platform/react-core';
import {PropertyType} from '@cuba-platform/rest';
import {decorateAndWrapInFormItem} from './DataTableCustomFilterFields';
import {stripMilliseconds} from '@cuba-platform/react-core';

interface DataTableListEditorDateTimePickerProps {
  id: string;
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode;
  onInputChange: (value: string, caption: string) => void;
  onInputConfirm: () => void;
  propertyType: PropertyType;
}

class DataTableListEditorDateTimePickerComponent extends React.Component<DataTableListEditorDateTimePickerProps & WrappedComponentProps> {
  @observable.ref moment!: Moment;

  @action
  onMomentChange = (newMoment: Moment | null, _dateString: string): void => {
    if (newMoment != null) {
      this.moment = stripMilliseconds(newMoment);
    }
  };

  @action
  onConfirm = (): void => {
    const caption = this.moment.format(getDisplayFormat(this.props.propertyType));
    const value = this.moment.format(getDataTransferFormat(this.props.propertyType));
    this.props.onInputChange(value, caption);
    this.props.onInputConfirm();
  };

  render() {
    const datePicker = (
      <DatePicker placeholder='YYYY-MM-DD'
                  onChange={this.onMomentChange}
      />
    );
    const datePickerInput = decorateAndWrapInFormItem(
      datePicker, this.props.id, this.props.getFieldDecorator, this.props.intl, true
    );

    const timePicker = (
      <TimePicker placeholder='HH:mm:ss'
                  defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                  onChange={this.onMomentChange}
      />
    );
    const timePickerInput = decorateAndWrapInFormItem(
      timePicker, this.props.id, this.props.getFieldDecorator, this.props.intl, true
    );

    return (
      <div className='cuba-filter-controls-layout -no-wrap'>
        {datePickerInput}
        {timePickerInput}
        <Form.Item className='filtercontrol'>
          <Button htmlType='button'
                  disabled={!this.moment}
                  onClick={this.onConfirm}
                  type='default'>
            <FormattedMessage id='cubaReact.dataTable.add'/>
          </Button>
        </Form.Item>
      </div>
    );
  }
}

const dataTableListEditorDateTimePicker =
    injectIntl(
      DataTableListEditorDateTimePickerComponent
    );

export {dataTableListEditorDateTimePicker as DataTableListEditorDateTimePicker};
