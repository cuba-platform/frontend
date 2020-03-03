import {IntlShape, WrappedComponentProps} from 'react-intl';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import * as React from 'react';
import {FormCreateOption} from 'antd/lib/form';

export function withLocalizedForm<P>(options?: FormCreateOption<P>) {
  return (Component: React.ComponentType<P>) => {
    return (props: P & WrappedComponentProps) => {
      const ComponentWithForm = Form.create<P & WrappedComponentProps & FormComponentProps>({
        validateMessages: createAntdFormValidationMessages(props.intl),
        ...options
      // @ts-ignore
      })(Component);

      return <ComponentWithForm {...props as unknown as P & WrappedComponentProps & FormComponentProps } />;
    };
  };
}

export function createAntdFormValidationMessages(intl: IntlShape) {
  return {
    default: intl.formatMessage({id: 'antd.form.validation.default'}),
    required: intl.formatMessage({id: 'antd.form.validation.required'}),
    enum: intl.formatMessage({id: 'antd.form.validation.enum'}),
    whitespace: intl.formatMessage({id: 'antd.form.validation.whitespace'}),
    date: {
      format: intl.formatMessage({id: 'antd.form.validation.date.format'}),
      parse: intl.formatMessage({id: 'antd.form.validation.date.parse'}),
      invalid: intl.formatMessage({id: 'antd.form.validation.date.invalid'}),
    },
    types: {
      string: intl.formatMessage({id: 'antd.form.validation.types.string'}),
      method: intl.formatMessage({id: 'antd.form.validation.types.method'}),
      array: intl.formatMessage({id: 'antd.form.validation.types.array'}),
      object: intl.formatMessage({id: 'antd.form.validation.types.object'}),
      number: intl.formatMessage({id: 'antd.form.validation.types.number'}),
      date: intl.formatMessage({id: 'antd.form.validation.types.date'}),
      boolean: intl.formatMessage({id: 'antd.form.validation.types.boolean'}),
      integer: intl.formatMessage({id: 'antd.form.validation.types.integer'}),
      float: intl.formatMessage({id: 'antd.form.validation.types.float'}),
      regexp: intl.formatMessage({id: 'antd.form.validation.types.regexp'}),
      email: intl.formatMessage({id: 'antd.form.validation.types.email'}),
      url: intl.formatMessage({id: 'antd.form.validation.types.url'}),
      hex: intl.formatMessage({id: 'antd.form.validation.types.hex'}),
    },
    string: {
      len: intl.formatMessage({id: 'antd.form.validation.string.len'}),
      min: intl.formatMessage({id: 'antd.form.validation.string.min'}),
      max: intl.formatMessage({id: 'antd.form.validation.string.max'}),
      range: intl.formatMessage({id: 'antd.form.validation.string.range'}),
    },
    number: {
      len: intl.formatMessage({id: 'antd.form.validation.number.len'}),
      min: intl.formatMessage({id: 'antd.form.validation.number.min'}),
      max: intl.formatMessage({id: 'antd.form.validation.number.max'}),
      range: intl.formatMessage({id: 'antd.form.validation.number.range'}),
    },
    array: {
      len: intl.formatMessage({id: 'antd.form.validation.array.len'}),
      min: intl.formatMessage({id: 'antd.form.validation.array.min'}),
      max: intl.formatMessage({id: 'antd.form.validation.array.max'}),
      range: intl.formatMessage({id: 'antd.form.validation.array.range'}),
    },
    pattern: {
      mismatch: intl.formatMessage({id: 'antd.form.validation.pattern.mismatch'}),
    },
  };
}


