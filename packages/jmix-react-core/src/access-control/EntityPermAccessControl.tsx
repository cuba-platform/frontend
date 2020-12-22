import { EntityOperationType } from "@haulmont/jmix-rest";
import {AccessControl} from './AccessControl';
import * as React from "react";

interface EntityPermAccessControlProps {
  entityName: string;
  /**
   * Required operation permission. Defaults to `read`.
   */
  operation?: EntityOperationType;
  /**
   * What should happen when the requirement is NOT met. `hide` means that access-controlled components
   * won't be rendered, `disable` means that the components will be rendered as disabled / non-modifiable.
   */
  mode?: 'hide' | 'disable';
  /**
   * The name of the prop that will be passed to `children` if {@link mode} is `disable`
   * and the requirement is not fulfilled. Defaults to `disabled`.
   */
  disabledPropName?: string;
  /**
   * The value of the prop that will be passed to `children` if {@link mode} is `disable`
   * and the requirement is not fulfilled. Defaults to `true`.
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
 * based on a single entity (CRUD) permission.
 *
 * @param props
 */
export const EntityPermAccessControl = (props: React.PropsWithChildren<EntityPermAccessControlProps>) => {
  const {
    entityName, operation = 'read', mode = 'hide', disabledPropName, disabledPropValue, render, children
  } = props;

  const reqs = {
    entityReqs: [{
      entityName,
      operation
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