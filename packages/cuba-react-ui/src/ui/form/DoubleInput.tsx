import {InputNumber} from "antd";
import * as React from "react";
import './InputNumber.less';
import {forwardRef, Ref} from 'react';
import {InputNumberProps} from 'antd/es/input-number';

export const DoubleInput = forwardRef((props: InputNumberProps, ref: Ref<InputNumber>) => {
  return (
    <InputNumber className='inputnumber-field'
                 ref={ref}
                 {...props}
    />
  );
});
