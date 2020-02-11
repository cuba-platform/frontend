import * as React from "react";
import {Checkbox, DatePicker, Input, InputNumber, Select, TimePicker} from "antd";
import {observer} from "mobx-react";
import {Cardinality, EnumInfo, EnumValueInfo, MetaPropertyInfo, PropertyType} from "@cuba-platform/rest"
import {FileUpload, FileUploadProps} from './FileUpload';
import {EntitySelectField} from "./EntitySelectField";
import {MainStoreInjected, DataCollectionStore, WithId, injectMainStore, getPropertyInfo, isFileProperty} from "@cuba-platform/react-core";
import './FormField.less';
import {UuidField} from "./form/UuidField";
import {SelectProps} from "antd/lib/select";
import {InputProps} from "antd/lib/input/Input";
import {CheckboxProps} from "antd/lib/checkbox/Checkbox";
import {DatePickerProps} from "antd/lib/date-picker/interface";
import {TimePickerProps} from "antd/lib/time-picker";
import {InputNumberProps} from "antd/lib/input-number";

export type FormFieldComponentProps = SelectProps | InputProps | InputNumberProps | CheckboxProps | DatePickerProps | TimePickerProps | FileUploadProps;

export type FormFieldProps = MainStoreInjected & {
  entityName: string
  propertyName: string
  disabled?: boolean
  optionsContainer?: DataCollectionStore<WithId>
} & FormFieldComponentProps

export const FormField = injectMainStore(observer((props: FormFieldProps) => {

  const {entityName, propertyName, optionsContainer, mainStore, ...rest} = props;

  if (mainStore == null || mainStore.metadata == null) {
    return <Input {...(rest as InputProps)}/>;
  }
  const propertyInfo = getPropertyInfo(mainStore!.metadata, entityName, propertyName);
  if (propertyInfo == null) {
    return <Input {...(rest as InputProps)}/>
  }

  if (isFileProperty(propertyInfo)) {
    return <FileUpload {...(rest as FileUploadProps)}/>;
  }

  switch (propertyInfo.attributeType) {
    case 'ENUM':
      return <EnumField enumClass={propertyInfo.type} allowClear={getAllowClear(propertyInfo)} {...rest}/>;
    case 'ASSOCIATION':
      const mode = getSelectMode(propertyInfo.cardinality);
      return <EntitySelectField {...{mode, optionsContainer}} allowClear={getAllowClear(propertyInfo)} {...rest}/>;
    case 'COMPOSITION':
      return <EntitySelectField {...rest} allowClear={getAllowClear(propertyInfo)} />;
  }
  switch (propertyInfo.type as PropertyType) {
    case 'boolean':
      return <Checkbox {...(rest as CheckboxProps)}/>;
    case 'date':
    case 'localDate':
      return <DatePicker {...(rest as DatePickerProps)}/>;
    case 'dateTime':
    case 'localDateTime':
    case 'offsetDateTime':
      return <DatePicker showTime={true} {...(rest as DatePickerProps)}/>;
    case 'time':
    case 'localTime':
    case 'offsetTime':
      return <TimePicker {...(rest as TimePickerProps)}/>;
    case 'int':
      return <InputNumber min={JAVA_INTEGER_MIN_VALUE}
                          max={JAVA_INTEGER_MAX_VALUE}
                          precision={0}
                          className='inputnumber-field'
                          {...(rest as InputNumberProps)}
             />;
    case 'double':
      return <InputNumber className='inputnumber-field' {...(rest as InputNumberProps)}/>;
    case 'long': // TODO values > Number.MAX_SAFE_INTEGER are not currently supported https://github.com/cuba-platform/frontend/issues/99
      return <InputNumber className='inputnumber-field'
                          // TODO once values > Number.MAX_SAFE_INTEGER add validation agains Long.MIN_VALUE/MAX_VALUE
                          precision={0}
                          {...(rest as InputNumberProps)}
             />;
    case 'decimal': // TODO values > Number.MAX_SAFE_INTEGER are not currently supported https://github.com/cuba-platform/frontend/issues/99
      return <InputNumber className='inputnumber-field'
                          // TODO Add validation of precision/scale https://github.com/cuba-platform/frontend/issues/100
                          {...(rest as InputNumberProps)}
             />;
    case 'uuid':
      return <UuidField {...rest}/>
  }
  return <Input {...(rest as InputProps)}/>;
}));


export const EnumField = injectMainStore(observer(({enumClass, mainStore, ...rest}) => {
  let enumValues: EnumValueInfo[] = [];
  if (mainStore!.enums != null) {
    const enumInfo = mainStore!.enums.find((enm: EnumInfo) => enm.name === enumClass);
    if (enumInfo != null) {
      enumValues = enumInfo.values;
    }
  }
  return <Select {...rest} >
    {enumValues.map(enumValue =>
      <Select.Option key={enumValue.name} value={enumValue.name}>{enumValue.caption}</Select.Option>
    )}
  </Select>
}));

function getSelectMode(cardinality: Cardinality): "default" | "multiple" {
  if (cardinality === "ONE_TO_MANY" || cardinality === "MANY_TO_MANY") {
    return "multiple"
  }
  return "default";
}

function getAllowClear(propertyInfo: MetaPropertyInfo): boolean {
  return !propertyInfo.mandatory;
}

const JAVA_INTEGER_MIN_VALUE = -2_147_483_648;
const JAVA_INTEGER_MAX_VALUE = 2_147_483_647;
