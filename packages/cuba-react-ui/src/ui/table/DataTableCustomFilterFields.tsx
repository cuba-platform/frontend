import {IntlShape} from 'react-intl';
import {GetFieldDecoratorOptions} from 'antd/es/form/Form';
import React, {ReactNode} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

export function getDefaultFieldDecoratorOptions(intl: IntlShape): GetFieldDecoratorOptions {
  return {
    initialValue: null,
    rules: [
      {
        required: true,
        message: intl.formatMessage({id: 'cubaReact.dataTable.validation.requiredField'})
      }
    ]
  };
}

export function decorateAndWrapInFormItem(
  children: ReactNode,
  parentId: string,
  // tslint:disable-next-line:ban-types
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions | undefined) => (node: ReactNode) => ReactNode,
  intl: IntlShape,
  hasFeedback: boolean = false,
  options?: GetFieldDecoratorOptions,
  additionalClassName?: string,
): ReactNode {
  if (!options) {
    options = getDefaultFieldDecoratorOptions(intl);
  }

  return (
    <Form.Item hasFeedback={hasFeedback} className={`filtercontrol ${additionalClassName || ''}`}>
      {getFieldDecorator(`${parentId}_input`, options)(
        children
      )}
    </Form.Item>
  );
}