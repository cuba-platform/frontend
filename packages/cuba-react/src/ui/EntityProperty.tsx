import * as React from "react";
import {injectMainStore, MainStoreInjected} from "../app/MainStore";
import {observer} from "mobx-react";

type Props = MainStoreInjected & {
  entityName: string;
  propertyName: string;
  showLabel?: boolean;
  hideIfEmpty?: boolean;
  value: any;
}

const EntityPropertyFormattedValue = (props: Props) => {
    const {
      entityName,
      propertyName,
      value,
      mainStore,
      showLabel = true,
      hideIfEmpty = true,
    } = props;
    if (hideIfEmpty && value == null) {
      return null;
    }
    if (mainStore == null || mainStore.messages == null || !showLabel) {
      return <div>{formatValue(value)}</div>;
    }
    const {messages} = mainStore;
    const label: string = messages[entityName + '.' + propertyName];
    return label != null
      ? <div><strong>{label}:</strong> {formatValue(value)}</div>
      : <div>{formatValue(value)}</div>
};

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
  }
  return JSON.stringify(value);
}