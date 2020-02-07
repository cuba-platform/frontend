import {Checkbox} from 'antd';
import React, {ReactNode} from 'react';
import {MetaPropertyInfo, SerializedEntityProps} from '@cuba-platform/rest';
import { MainStoreInjected, MainStore, getEnumCaption } from '@cuba-platform/react-core';
import { toDisplayValue } from '../../util/formatting';

type DataTableCellProps<EntityType> = MainStoreInjected & {
  text: any,
  propertyInfo: MetaPropertyInfo,
  mainStore: MainStore,
  record?: EntityType
}

export const DataTableCell = <EntityType extends unknown>(props: DataTableCellProps<EntityType>): ReactNode => {
  if (props.propertyInfo.type === 'boolean') {
    return (
      <Checkbox
        checked={props.text as boolean}
        disabled={true}
      />
    );
  }

  if (props.propertyInfo.attributeType === 'ENUM') {
    return (
      <EnumCell text={props.text} propertyInfo={props.propertyInfo} mainStore={props.mainStore!}/>
    );
  }

  if (props.propertyInfo.attributeType === 'ASSOCIATION' && props.propertyInfo.cardinality === 'MANY_TO_MANY') {
    const associatedEntities = props.record?.[props.propertyInfo.name as keyof EntityType] as unknown as SerializedEntityProps[];
    const displayValue = associatedEntities?.map(entity => entity._instanceName).join(', ');
    return (
      <div>{displayValue}</div>
    );
  }

  return (
    <div>{toDisplayValue(props.text, props.propertyInfo)}</div>
  );
};

const EnumCell = <EntityType extends unknown>(props: DataTableCellProps<EntityType>) => {
  const caption = getEnumCaption(props.text, props.propertyInfo, props.mainStore!.enums!);

  if (caption) {
    return (
      <div>{caption}</div>
    );
  } else {
    return <div/>;
  }
};
