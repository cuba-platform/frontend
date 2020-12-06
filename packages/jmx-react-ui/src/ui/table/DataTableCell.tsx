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

  const {type, attributeType, cardinality, name} = props.propertyInfo;

  if (type === 'boolean') {
    return (
      <Checkbox
        checked={props.text as boolean}
        disabled={true}
      />
    );
  }

  if (attributeType === 'ENUM') {
    return (
      <EnumCell text={props.text} propertyInfo={props.propertyInfo} mainStore={props.mainStore!}/>
    );
  }

  if (attributeType === 'ASSOCIATION' && cardinality === 'MANY_TO_MANY') {
    const associatedEntities = props.record?.[name as keyof EntityType] as unknown as SerializedEntityProps[];
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
  return <div>{caption ? caption : ''}</div>;
};
