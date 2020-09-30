import { EntityAttrPermissionValue } from "@cuba-platform/rest";
import * as React from "react";
import {AccessControl} from './AccessControl';

interface AttrPermAccessControlProps {
  entityName: string;
  attrName: string;
  /**
   * Required attribute permission. Defaults to `VIEW`.
   */
  requiredAttrPerm?: Exclude<EntityAttrPermissionValue, 'DENY'>;
  /**
   * See {@link EntityPermAccessControlProps.mode}
   */
  mode?: 'hide' | 'disable';
  /**
   * See {@link EntityPermAccessControlProps.disabledPropName}
   */
  disabledPropName?: string;
  /**
   * See {@link EntityPermAccessControlProps.disabledPropValue}
   */
  disabledPropValue?: any;
  /**
   * See {@link AccessControlProps.render}
   *
   * @param disabled
   */
  render?: (disabled: boolean) => React.ReactNode;
}

/**
 * This component can be used to conditionally render other components (which we call access-controlled components)
 * based on a single entity attribute permission.
 *
 * @param props
 */
export const AttrPermAccessControl = (props: React.PropsWithChildren<AttrPermAccessControlProps>) => {
  const {
    entityName, attrName, requiredAttrPerm = 'VIEW', mode = 'hide',
    disabledPropName, disabledPropValue, render, children
  } = props;

  const reqs = {
    attrReqs: [{
      entityName,
      attrName,
      requiredAttrPerm,
    }]
  };

  const displayReqs = (mode === 'hide') ? reqs : undefined;
  const modifyReqs = (mode === 'disable') ? reqs : undefined;

  return (
    <AccessControl displayReqs={displayReqs}
                   modifyReqs={modifyReqs}
                   disabledPropName={disabledPropName}
                   disabledPropValue={disabledPropValue}
                   render={render}>
      {children}
    </AccessControl>
  );
};