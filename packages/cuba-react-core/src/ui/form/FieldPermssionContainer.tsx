import * as React from "react";
import {observer} from 'mobx-react';
import {injectMainStore, MainStoreInjected} from "../../app/MainStore";
import {EntityAttrPermissionValue} from '@cuba-platform/rest';

type Props = MainStoreInjected & {
  entityName: string
  propertyName: string
  renderField: (isReadOnly: boolean) => React.ReactNode
}

export const FieldPermissionContainer = injectMainStore(observer((props: Props) => {

  if (!props.mainStore) return null;

  const {entityName, propertyName} = props;
  const {getAttributePermission} = props.mainStore.security;

  const perm: EntityAttrPermissionValue = getAttributePermission(entityName, propertyName);
  const isAllowed = perm === 'MODIFY';
  const isReadOnly = perm === 'VIEW';

  if (!isAllowed && !isReadOnly) return null;

  return <>{props.renderField(isReadOnly)}</>

}));
