import {InputWithMask} from "./InputWithMask";
import React, {forwardRef, Ref} from "react";
import {Input} from 'antd';
import {InputProps} from 'antd/es/input';

export const UuidInput = forwardRef((props: InputProps, ref: Ref<Input>) => {
  return (
    <InputWithMask mask='xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'
                   formatChars={{
                     'x': '[0-9a-fA-F]',
                     'M': '[0-5]', // UUID version
                     'N': '[089ab]', // UUID variant
                   }}
                   ref={ref}
                   {...props}
    />
  );
});
