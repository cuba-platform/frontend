import * as React from "react";
import {Checkbox, DatePicker, Input, Select} from "antd";
import {observer} from "mobx-react";
import {injectMainStore, MainStoreInjected, PropertyType} from "../app/MainStore";
import {Cardinality, EnumInfo, EnumValueInfo} from "@cuba-platform/rest"
import {getPropertyInfo, WithId} from "../util/metadata";
import {DataCollectionStore} from "../data/Collection";

type Props = MainStoreInjected & {
  entityName: string;
  propertyName: string;
  optionsContainer?: DataCollectionStore<WithId>;
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
  switch (propertyInfo.attributeType) {
    case 'ENUM':
      return <EnumField enumClass={propertyInfo.type} {...rest}/>;
    case 'ASSOCIATION':
      const mode = getSelectMode(propertyInfo.cardinality);
      return <Select mode={mode} {...rest}/>;
    case 'COMPOSITION':
      return <Select {...rest}/>;
  }
  switch (propertyInfo.type as PropertyType) {
    case 'boolean':
      return <Checkbox {...rest}/>;
    case 'date':
      return <DatePicker {...rest}/>;
    case 'dateTime':
      return <DatePicker showTime={true} {...rest}/>;
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
  return <Select {...rest}>
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