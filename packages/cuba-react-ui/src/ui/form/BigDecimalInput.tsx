import {InputNumber} from 'antd';
import * as React from 'react';
import './InputNumber.less';
import {forwardRef, Ref} from 'react';
import {InputNumberProps} from 'antd/es/input-number';

// TODO values > Number.MAX_SAFE_INTEGER are not currently supported https://github.com/cuba-platform/frontend/issues/99
// TODO Add validation of precision/scale https://github.com/cuba-platform/frontend/issues/100
export const BigDecimalInput = forwardRef((props: InputNumberProps, ref: Ref<InputNumber>) => {
  return (
    <InputNumber className='inputnumber-field'
                 ref={ref}
                 {...props}
    />
  );
});
