import {Checkbox} from 'antd';
import React, {ReactNode} from 'react';
import {MetaPropertyInfo} from '@cuba-platform/rest';
import { MainStoreInjected, MainStore, getEnumCaption } from '@cuba-platform/react-core';
import {toDisplayValue} from '../EntityProperty';

type DataTableCellProps = MainStoreInjected & {
  text: any,
  propertyInfo: MetaPropertyInfo,
  mainStore: MainStore,
}

export const DataTableCell = (props: DataTableCellProps): ReactNode => {
  if (props.propertyInfo.type === 'boolean') {
    return (
      <Checkbox
        checked={props.text as boolean}
        disabled={true}
      />
    );
  } else if (props.propertyInfo.attributeType === 'ENUM') {
    return (
      <EnumCell text={props.text} propertyInfo={props.propertyInfo} mainStore={props.mainStore!} />
    );
  } else {
    return (
      <div>{toDisplayValue(props.text, props.propertyInfo)}</div>
    );
  }
};

const EnumCell = (props: DataTableCellProps) => {
  const caption = getEnumCaption(props.text, props.propertyInfo, props.mainStore!.enums!);

  if (caption) {
    return (
      <div>{caption}</div>
    );
  } else {
    return <div/>;
  }
};
