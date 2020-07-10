import {IntlShape} from 'react-intl';
import React, {ReactNode} from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/es/form';

export function getDefaultFormItemProps(intl: IntlShape, name?: string): FormItemProps {
  const formItemProps: FormItemProps = {
    initialValue: null,
    rules: [
      {
        required: true,
        message: intl.formatMessage({id: 'cubaReact.dataTable.validation.requiredField'})
      }
    ]
  };
  if (name != null) {
    formItemProps.name = name;
  }
  return formItemProps;
}

export function decorateAndWrapInFormItem(
  children: ReactNode,
  name: string,
  intl: IntlShape,
  hasFeedback: boolean = false,
  formItemProps?: FormItemProps,
  additionalClassName?: string,
): ReactNode {
  if (!formItemProps) {
    formItemProps = getDefaultFormItemProps(intl, name);
  }

  return (
    <Form.Item hasFeedback={hasFeedback} className={`filtercontrol ${additionalClassName || ''}`} {...formItemProps}>
      {children}
    </Form.Item>
  );
}