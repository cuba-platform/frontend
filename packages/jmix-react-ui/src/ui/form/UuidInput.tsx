import {InputWithMask} from "./InputWithMask";
import React, {forwardRef, Ref} from "react";
import {Input} from 'antd';
import {InputProps} from 'antd/es/input';

// More strict validation would be:
//
// <InputWithMask mask='xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'
//                formatChars={{
//                  'x': '[0-9a-fA-F]',
//                  'M': '[0-5]', // UUID version
//                  'N': '[089ab]', // UUID variant
//                }}
//
// However, we are using relaxed validation rules as Backoffice UI allows to create UUIDs with invalid
// versions and variants (https://github.com/cuba-platform/cuba/issues/2867)
// TODO Once https://github.com/cuba-platform/cuba/issues/2867 is fixed, determine the rule dynamically based on Platform version.
export const UuidInput = forwardRef((props: InputProps, ref: Ref<Input>) => {
  return (
    <InputWithMask mask='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                   formatChars={{
                     'x': '[0-9a-fA-F]'
                   }}
                   ref={ref}
                   {...props}
    />
  );
});
