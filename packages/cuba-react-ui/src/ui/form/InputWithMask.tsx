import React, {forwardRef, Ref} from 'react';
import ReactInputMask, { Props as ReactInputMaskProps } from 'react-input-mask';
import {Input} from 'antd';
import {InputProps} from "antd/es/input";

export type InputWithMaskProps = Omit<ReactInputMaskProps, 'size' | 'prefix'> & InputProps;

export const InputWithMask = forwardRef((props: InputWithMaskProps, ref: Ref<Input>) => {
  const {size, prefix, value, ...rest} = props;

  // ReactInputMask will not pass `value` to the Input if it's value is null
  const passedValue = value ? value : '';

  return (
    <ReactInputMask value={passedValue} {...rest}>
      {(inputProps: InputProps) => {
        return <Input ref={ref} {...inputProps} prefix={prefix} size={size}/>;
      }
      }
    </ReactInputMask>
  );
});
