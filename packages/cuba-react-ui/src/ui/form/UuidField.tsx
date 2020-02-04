import { InputWithMask } from "./InputWithMask";
import React from "react";

type Props = {
  disabled?: boolean
};

export const UuidField = (props: Props) => {
  return (
    <InputWithMask mask='xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'
                   formatChars={{
                     'x': '[0-9a-fA-F]',
                     'M': '[0-5]', // UUID version
                     'N': '[089ab]', // UUID variant
                   }}
                   {...props}
    />
  );
};
