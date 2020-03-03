import * as React from "react";
import {Checkbox, DatePicker, Input, Select, TimePicker} from "antd";
import {observer} from "mobx-react";
import {Cardinality, EnumInfo, EnumValueInfo, MetaPropertyInfo, PropertyType, SerializedEntityProps} from "@cuba-platform/rest"
import {FileUpload, FileUploadProps} from './FileUpload';
import {EntitySelectField} from "./EntitySelectField";
import {MainStoreInjected, DataCollectionStore, WithId, injectMainStore, getPropertyInfo, isFileProperty} from "@cuba-platform/react-core";
import './form/InputNumber.less';
import {UuidInput} from "./form/UuidInput";
import {DoubleInput} from "./form/DoubleInput";
import {IntegerInput} from "./form/IntegerInput";
import {LongInput} from "./form/LongInput";
import {BigDecimalInput} from "./form/BigDecimalInput";
import {SelectProps} from "antd/lib/select";
import {InputProps} from "antd/lib/input/Input";
import {CheckboxProps} from "antd/lib/checkbox/Checkbox";
import {DatePickerProps} from "antd/lib/date-picker/interface";
import {TimePickerProps} from "antd/lib/time-picker";
import {InputNumberProps} from "antd/lib/input-number";
import {NestedEntityEditor, NestedEntityEditorProps} from "./form/NestedEntityEditor";
import {NestedEntityBrowser} from "./form/NestedEntityBrowser";

export type FormFieldComponentProps = SelectProps | InputProps | InputNumberProps | CheckboxProps | DatePickerProps | TimePickerProps | FileUploadProps
  | NestedEntityEditorProps;

export type FormFieldProps = MainStoreInjected & {
  entityName: string;
  propertyName: string;
  disabled?: boolean;
  optionsContainer?: DataCollectionStore<WithId>;
  nestedEntityName?: string;
  nestedEntityType?: new () => Partial<WithId & SerializedEntityProps>;
  nestedEntityView?: string;
} & FormFieldComponentProps

export const FormField = injectMainStore(observer((props: FormFieldProps) => {

  const {
    entityName, propertyName, optionsContainer, mainStore,
    nestedEntityName, nestedEntityType, nestedEntityView,
    ...rest
  } = props;

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
      if (nestedEntityName && nestedEntityType && nestedEntityView) {
        if (propertyInfo.cardinality === 'ONE_TO_ONE') {
          return <NestedEntityEditor nestedEntityName={nestedEntityName}
                                     nestedEntityType={nestedEntityType}
                                     nestedEntityView={nestedEntityView}
                                     {...(rest as NestedEntityEditorProps)}
                 />;
        }
        if (propertyInfo.cardinality === 'ONE_TO_MANY') {
          return <NestedEntityBrowser/>;
        }
      }
      return null;
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
      return <IntegerInput {...(rest as InputNumberProps)}/>;
    case 'double':
      return <DoubleInput {...(rest as InputNumberProps)}/>;
    case 'long':
      return <LongInput {...(rest as InputNumberProps)}/>;
    case 'decimal':
      return <BigDecimalInput {...(rest as InputNumberProps)}/>;
    case 'uuid':
      return <UuidInput {...(rest as InputProps)}/>
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
