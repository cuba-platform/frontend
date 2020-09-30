import * as React from "react";
import {useMainStore, MainStore} from '../app/MainStore';
import { EntityOperationType, EntityAttrPermissionValue } from "@cuba-platform/rest";
import { useObserver } from "mobx-react";

export interface AccessControlProps {
  /**
   * Requirements that shall be fulfilled in order for access-controlled components to be rendered.
   * If missing - access-controlled components will always be rendered.
   */
  displayReqs?: AccessControlRequirements;
  /**
   * Requirements that shall be fulfilled in order for rendered access-controlled components to be modifiable
   * (i.e. to not be disabled).
   * If missing - access-controlled components will never be disabled.
   */
  modifyReqs?: AccessControlRequirements;
  /**
   * The name of the prop that will be passed to `children` if {@link modifyReqs}
   * are not fulfilled. Defaults to `disabled`.
   */
  disabledPropName?: string;
  /**
   * The value of the prop that will be passed to `children` if {@link modifyReqs}
   * are not fulfilled. Defaults to `true`.
   */
  disabledPropValue?: any;
  /**
   * Render prop. If not provided, component's `children` will be used instead.
   *
   * @param disabled indicates whether the access-controlled components shall be disabled.
   */
  render?: (disabled: boolean) => React.ReactNode;
}

export interface AccessControlRequirements {
  /**
   * Required entity operation permissions.
   */
  entityReqs?: EntityPermissionRequirement[];
  /**
   * Required entity attribute permissions.
   */
  attrReqs?: AttributePermissionRequirement[];
  /**
   * Required specific permissions.
   */
  specificReqs?: string[];
  /**
   * A function that can be used to implement custom conditions / complex logic.
   */
  customReqs?: () => boolean
}

export interface EntityPermissionRequirement {
  entityName: string;
  /**
   * Required operation permission. Defaults to `read`.
   */
  operation?: EntityOperationType;
}

export interface AttributePermissionRequirement {
  entityName: string;
  attrName: string;
  /**
   * Required attribute permission.
   */
  requiredAttrPerm: Exclude<EntityAttrPermissionValue, 'DENY'>;
}

/**
 * This component can be used to conditionally render other components (which we call access-controlled components)
 * based on user permissions and other conditions.
 *
 * This component is intended to be used in complex cases (such as when requirements includes multiple types of permissions,
 * e.g. an entity permission and a specific permission).
 * In most cases simpler components should be used instead:
 * {@link EntityPermAccessControl} when condition involves a single entity CRUD permission,
 * {@link AttrPermAccessControl} when condition involves a single entity attribute permission
 * and {@link SpecificPermAccessControl} when condition involves one or more specific permissions.
 *
 * @param props
 */
export const AccessControl = (props: React.PropsWithChildren<AccessControlProps>) => {
  const {displayReqs, modifyReqs, disabledPropName = 'disabled', disabledPropValue = true, render, children } = props;

  const mainStore = useMainStore();

  return useObserver(() => {
    if (!mainStore.security.isDataLoaded) {
      return null;
    }

    const shouldDisplay = areAllRequirementsSatisfied(mainStore, displayReqs);
    const shouldAllowModification = areAllRequirementsSatisfied(mainStore, modifyReqs);

    if (!shouldDisplay) {
      return null;
    }

    if (render != null) {
      return <>{render(!shouldAllowModification)}</>;
    }

    if (shouldAllowModification) {
      return <>{children}</>;
    }

    return <>{injectDisabledProp(children, disabledPropName, disabledPropValue)}</>;
  });
};

function injectDisabledProp(
  children: React.ReactNode, disabledPropName: string, disabledPropValue: any
): React.ReactNode {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {[disabledPropName]: disabledPropValue});
    }
    return child;
  });
}

function areAllRequirementsSatisfied(mainStore: MainStore, requirements?: AccessControlRequirements): boolean {
  if (requirements == null) {
    return true;
  }

  const {entityReqs, attrReqs, specificReqs, customReqs} = requirements;

  return areEntityRequirementsSatisfied(mainStore, entityReqs)
    && areAttributeRequirementsSatisfied(mainStore, attrReqs)
    && areSpecificRequirementsSatisfied(mainStore, specificReqs)
    && areCustomRequirementsSatisfied(customReqs);
}

function areEntityRequirementsSatisfied(
  mainStore: MainStore,
  entityReqs?: EntityPermissionRequirement[]
): boolean {
  if (entityReqs == null || entityReqs.length === 0) {
    return true;
  }

  return entityReqs.every(req => {
    const {entityName, operation = 'read'} = req;
    return mainStore.security.isOperationPermissionGranted(entityName, operation);
  });
}

function areAttributeRequirementsSatisfied(
  mainStore: MainStore,
  attrReqs?: AttributePermissionRequirement[]
): boolean {
  if (attrReqs == null || attrReqs.length === 0) {
    return true;
  }

  return attrReqs.every(req => {
    const {entityName, attrName, requiredAttrPerm} = req;
    return mainStore.security.isAttributePermissionGranted(entityName, attrName, requiredAttrPerm);
  });
}

function areSpecificRequirementsSatisfied(mainStore: MainStore, specificReqs?: string[]): boolean {
  if (specificReqs == null || specificReqs.length === 0) {
    return true;
  }

  return specificReqs.every(target => {
    return mainStore.security.isSpecificPermissionGranted(target);
  });
}

function areCustomRequirementsSatisfied(customReqs?: () => boolean): boolean {
  if (customReqs == null) {
    return true;
  }

  return customReqs();
}