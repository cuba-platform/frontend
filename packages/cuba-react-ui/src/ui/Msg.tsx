import {observer} from "mobx-react";
import * as React from "react";
import {MainStoreInjected, injectMainStore} from "../app/MainStore";

type Props = MainStoreInjected & {
  entityName: string;
  propertyName: string;
}

export const Msg = injectMainStore(observer(({entityName, propertyName, mainStore}: Props) => {
  if (mainStore == null || mainStore.messages == null) {
    return <>propertyName</>;
  }
  const {messages} = mainStore;
  const message: string = messages[entityName + '.' + propertyName];
  return message != null
    ? <>{message}</>
    : <>{propertyName}</>
}));