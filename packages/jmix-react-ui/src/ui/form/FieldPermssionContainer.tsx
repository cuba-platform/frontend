import * as React from "react";
import {observer} from 'mobx-react';
import { MainStoreInjected, injectMainStore, AccessControl, AccessControlRequirements } from "@haulmont/jmix-react-core";

type Props = MainStoreInjected & {
  entityName: string
  propertyName: string
  renderField: (isReadOnly: boolean) => React.ReactNode
}

export const FieldPermissionContainer = injectMainStore(observer((props: Props) => {

  const {entityName, propertyName, renderField} = props;

  const displayReqs: AccessControlRequirements = {
    attrReqs: [{
      entityName,
      attrName: propertyName,
      requiredAttrPerm: 'VIEW'
    }]
  };

  const modifyReqs: AccessControlRequirements = {
    attrReqs: [{
      entityName,
      attrName: propertyName,
      requiredAttrPerm: 'MODIFY'
    }]
  };

  return (
    <AccessControl displayReqs={displayReqs}
                   modifyReqs={modifyReqs}
                   render={renderField}
    />
  );

}));
