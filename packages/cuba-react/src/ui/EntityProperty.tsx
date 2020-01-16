import * as React from "react";
import {injectMainStore, MainStoreInjected} from "../app/MainStore";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {getEnumCaption, getPropertyInfo} from '../util/metadata';
import {MetaPropertyInfo} from '@cuba-platform/rest';

type Props = MainStoreInjected & {
  entityName: string;
  propertyName: string;
  showLabel?: boolean;
  hideIfEmpty?: boolean;
  value: any;
}

const EntityPropertyFormattedValue = observer((props: Props) => {
    const {
      entityName,
      propertyName,
      value,
      showLabel = true,
      hideIfEmpty = true,
      mainStore,
    } = props;

    if (hideIfEmpty && value == null) {
      return null;
    }
    if (props.mainStore == null || props.mainStore!.messages == null || !showLabel) {
      return <div>{formatValue(toJS(value))}</div>;
    }

    // store not ready yet
    if (!mainStore || !mainStore.messages || !mainStore.metadata || !mainStore.enums) {
      return null;
    }

    const label: string = props.mainStore!.messages![entityName + '.' + propertyName];

    const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
      props.mainStore!.metadata!,
      entityName,
      propertyName);

    if (!propertyInfo) {
      throw new Error('Cannot find MetaPropertyInfo for property ' + propertyName);
    }

    const displayValue = propertyInfo.attributeType === 'ENUM'
      ? getEnumCaption(value, propertyInfo, props.mainStore!.enums!)
      : toJS(value);

    return label != null
      ? <div><strong>{label}:</strong> {formatValue(displayValue)}</div>
      : <div>{formatValue(displayValue)}</div>
});

export const EntityProperty = injectMainStore(observer((props: Props) =>
    <EntityPropertyFormattedValue {...props}/>));

function formatValue(value: any): string {
  const valType = typeof value;
  if (valType === "string") {
    return value;
  }
  if (valType === "object") {
    if (Object.prototype.hasOwnProperty.call(value, '_instanceName')) {
      return value._instanceName!;
    }
    if (Array.isArray(value)) {
      const items = value.map(formatValue);
      return items.join(", ");
    }
  }
  return JSON.stringify(value);
}
