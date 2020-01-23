import * as React from "react";
import {Checkbox, DatePicker, Input, Select, TimePicker} from "antd";
import {observer} from "mobx-react";
import {Cardinality, EnumInfo, EnumValueInfo, MetaPropertyInfo, PropertyType} from "@cuba-platform/rest"
import {FileUpload} from './FileUpload';
import {EntitySelectField} from "./EntitySelectField";
import {MainStoreInjected, DataCollectionStore, WithId, injectMainStore, getPropertyInfo, isFileProperty} from "@cuba-platform/react-core";

type Props = MainStoreInjected & {
  entityName: string
  propertyName: string
  disabled?: boolean
  optionsContainer?: DataCollectionStore<WithId>
}

export const FormField = injectMainStore(observer((props: Props) => {

  const {entityName, propertyName, optionsContainer, mainStore, ...rest} = props;

  if (mainStore == null || mainStore.metadata == null) {
    return <Input {...rest}/>;
  }
  const propertyInfo = getPropertyInfo(mainStore!.metadata, entityName, propertyName);
  if (propertyInfo == null) {
    return <Input {...rest}/>
  }

  if (isFileProperty(propertyInfo)) {
    return <FileUpload {...rest}/>;
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
      return <Checkbox {...rest}/>;
    case 'date':
      return <DatePicker {...rest}/>;
    case 'dateTime':
      return <DatePicker showTime={true} {...rest}/>;
    case 'time':
      return <TimePicker {...rest}/>
  }
  return <Input {...rest}/>;
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
