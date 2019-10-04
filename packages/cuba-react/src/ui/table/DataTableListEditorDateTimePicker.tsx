import {Button, DatePicker, Form, TimePicker} from 'antd';
import moment, {Moment} from 'moment';
import * as React from 'react';
import {action, observable} from 'mobx';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import {ReactNode} from 'react';

interface DataTableListEditorDateTimePickerProps {
  id: string;
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode;
  onInputChange: (value: any, caption: any) => void;
  onInputConfirm: () => void;
}

export class DataTableListEditorDateTimePicker extends React.Component<DataTableListEditorDateTimePickerProps> {
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
          {this.props.getFieldDecorator(`${this.props.id}.input`, { initialValue: null, rules: [{required: true, message: 'Required field'}] })(
            <DatePicker placeholder='YYYY-MM-DD'
                        onChange={this.onMomentChange}
            />
          )}
        </Form.Item>
        <Form.Item hasFeedback={true} className={'data-table-custom-filter-form-item'}>
          {this.props.getFieldDecorator(`${this.props.id}.input`, { initialValue: null, rules: [{required: true, message: 'Required field'}] })(
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
