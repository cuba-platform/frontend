import * as React from "react";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import {MetaPropertyInfo} from '@cuba-platform/rest';
import {
  getEnumCaption,
  getPropertyInfo,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import {toDisplayValue} from '../util/formatting';

export interface EntityPropertyProps extends MainStoreInjected {
  entityName: string;
  propertyName: string;
  /**
   * Whether to show a localized property name as a label. Default: true.
   */
  showLabel?: boolean;
  /**
   * If `true`, the component will render as `null` when {@link value} is `null` or `undefined`
   */
  hideIfEmpty?: boolean;
  /**
   * Property value
   */
  value: any;
}

const EntityPropertyFormattedValue = observer((props: EntityPropertyProps) => {
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
  if (!showLabel) {
    return <div>{formatValue(toJS(value))}</div>;
  }

  // store not ready yet
  if (!mainStore || !mainStore.messages || !mainStore.metadata || !mainStore.enums) {
    return null;
  }

  const propertyFullName = entityName + '.' + propertyName;
  const label: string = mainStore.messages[propertyFullName];

  const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
    mainStore.metadata,
    entityName,
    propertyName);

  if (!propertyInfo) {
    throw new Error('Cannot find MetaPropertyInfo for property ' + propertyFullName);
  }

  const displayValue = propertyInfo.attributeType === 'ENUM'
    ? getEnumCaption(value, propertyInfo, mainStore.enums)
    : toDisplayValue(toJS(value), propertyInfo);

  return label != null
    ? <div><strong>{label}:</strong> {formatValue(displayValue)}</div>
    : <div>{formatValue(displayValue)}</div>
});

export const EntityProperty = injectMainStore(observer((props: EntityPropertyProps) =>
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
