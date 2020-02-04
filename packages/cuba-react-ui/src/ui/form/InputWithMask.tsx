import React from 'react';
import ReactInputMask, { Props as ReactInputMaskProps } from 'react-input-mask';
import {Input} from 'antd';
import {InputProps} from "antd/es/input";


export const InputWithMask = (props: ReactInputMaskProps) => {
  return (
    <ReactInputMask {...props}>
      {(inputProps: InputProps) => <Input {...inputProps}/>}
    </ReactInputMask>
  );
};
