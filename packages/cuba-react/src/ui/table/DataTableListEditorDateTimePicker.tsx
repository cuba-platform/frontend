import {Button, DatePicker, Form, TimePicker} from 'antd';
import moment, {Moment} from 'moment';
import * as React from 'react';
import {action, observable} from 'mobx';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import {ReactNode} from 'react';
import {injectIntl, WrappedComponentProps} from 'react-intl';

interface DataTableListEditorDateTimePickerProps {
  id: string;
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode;
  onInputChange: (value: any, caption: any) => void;
  onInputConfirm: () => void;
}

class DataTableListEditorDateTimePickerComponent extends React.Component<DataTableListEditorDateTimePickerProps & WrappedComponentProps> {
  @observable.ref moment!: Moment;

  @action
  onMomentChange = (newMoment: Moment | null, _dateString: string): void => {
    if (newMoment) {
      this.moment = newMoment;
    }
  };

  @action
  onConfirm = (): void => {
    const caption = this.moment.format('YYYY-MM-DD HH:mm:ss');
    const value = caption + '.000';
    this.props.onInputChange(value, caption);
    this.props.onInputConfirm();
  };

  render() {
    return (
      <div style={{whiteSpace: 'nowrap'}} className={'data-table-custom-filter-form-item-group'}>
        <Form.Item hasFeedback={true} className={'data-table-custom-filter-form-item'}>
          {this.props.getFieldDecorator(`${this.props.id}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
            <DatePicker placeholder='YYYY-MM-DD'
                        onChange={this.onMomentChange}
            />
          )}
        </Form.Item>
        <Form.Item hasFeedback={true} className={'data-table-custom-filter-form-item'}>
          {this.props.getFieldDecorator(`${this.props.id}.input`, { initialValue: null, rules: [{required: true, message: this.props.intl.formatMessage({id: 'cubaReact.dataTable.requiredField'})}] })(
            <TimePicker placeholder='HH:mm:ss'
                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                        onChange={this.onMomentChange}
            />
          )}
        </Form.Item>
        <Form.Item className={'data-table-custom-filter-form-item'}>
          <Button htmlType='button'
                  disabled={!this.moment}
                  onClick={this.onConfirm}
                  type='default'>
            Add
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
