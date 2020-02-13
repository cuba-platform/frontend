import {InputNumber} from "antd";
import * as React from "react";
import './InputNumber.less';
import {forwardRef, Ref} from 'react';
import {InputNumberProps} from 'antd/es/input-number';

// TODO values greater than Number.MAX_SAFE_INTEGER are not currently supported https://github.com/cuba-platform/frontend/issues/99
// TODO once it is supported - add validation agains Long.MIN_VALUE/MAX_VALUE
export const LongInput = forwardRef((props: InputNumberProps, ref: Ref<InputNumber>) => {
  return (
    <InputNumber className='inputnumber-field'
                 precision={0}
                 ref={ref}
                 {...props}
    />
  );
});
