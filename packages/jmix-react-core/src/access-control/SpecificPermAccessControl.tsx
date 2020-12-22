import * as React from 'react';
import {AccessControl} from './AccessControl';

interface SpecificPermAccessControlProps {
  /**
   * Required specific permission(s)
   */
  perm: string | string[];
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
 * based on one or multiple specific permissions.
 *
 * @param props
 */
export const SpecificPermAccessControl = (props: React.PropsWithChildren<SpecificPermAccessControlProps>) => {
  const {perm, mode = 'hide', disabledPropName, disabledPropValue, render, children} = props;

  const reqs = {
    specificReqs: Array.isArray(perm) ? perm : [perm]
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