import {action, computed, observable, ObservableMap} from 'mobx';
import {
  CubaApp,
  EntityAttrPermissionValue,
  EffectivePermsInfo,
  getAttributePermission,
  isOperationAllowed,
  isSpecificPermissionGranted,
  EntityOperationType,
  CubaRestError
} from '@cuba-platform/rest';


export class Security {

  @observable attrPermissionCache: ObservableMap<string, EntityAttrPermissionValue> = new ObservableMap();
  @observable private effectivePermissions?: EffectivePermsInfo;
  @observable private restSupportEffectivePerms: boolean = true;
  permissionsRequestCount = 0;

  constructor(private cubaREST: CubaApp) {
  }

  /**
   * Indicates whether the permissions data has been successfully loaded from backend.
   * NOTE: will always return `true` if the REST API version doesn't support effective permissions
   * (REST API version < 7.2).
   */
  @computed get isDataLoaded(): boolean {
    return this.effectivePermissions != null || !this.restSupportEffectivePerms;
  };

  /**
   * Returns current user permissions.
   */
  @computed get permissions(): EffectivePermsInfo {
    return JSON.parse(JSON.stringify(this.effectivePermissions));
  }

  getAttributePermission = (entityName: string, attributeName: string): EntityAttrPermissionValue => {

    if (!this.isDataLoaded) return 'DENY';

    // do not deny anything for rest version prev 7.2
    if (!this.restSupportEffectivePerms) return 'MODIFY';

    const attrFqn = `${entityName}:${attributeName}`;

    let perm = this.attrPermissionCache.get(attrFqn);
    if (perm != null) return perm;

    perm = getAttributePermission(entityName, attributeName, this.effectivePermissions);
    this.attrPermissionCache.set(attrFqn, perm);
    return perm;
  };

  /**
   * Returns a boolean indicating whether the current user is allowed to upload files.
   * This is convenience method that checks whether a user has a `create` operation permission
   * on `sys$FileDescriptor` entity and `cuba.restApi.fileUpload.enabled` specific permission.
   */
  canUploadAndLinkFile = (): boolean => {
    if (!this.isDataLoaded) {
      return false;
    }
    if (!this.restSupportEffectivePerms) {
      return true;
    }

    return isOperationAllowed('sys$FileDescriptor', 'create', this.effectivePermissions)
      && isSpecificPermissionGranted('cuba.restApi.fileUpload.enabled', this.effectivePermissions);
  };

  /**
   * Returns a boolean indicating whether a given entity operation permission is granted
   * to the current user.
   *
   * @param entityName
   * @param operation
   */
  isOperationPermissionGranted = (entityName: string, operation: EntityOperationType): boolean => {
    if (!this.isDataLoaded) { return false; }
    if (!this.restSupportEffectivePerms) { return true; }

    return isOperationAllowed(entityName, operation, this.effectivePermissions);
  };

  /**
   * Returns a boolean indicating whether a given entity attribute permission is granted
   * to the current user.
   *
   * @param entityName
   * @param attrName
   * @param requiredAttrPerm
   */
  isAttributePermissionGranted = (
    entityName: string,
    attrName: string,
    requiredAttrPerm: Exclude<EntityAttrPermissionValue, 'DENY'>
  ): boolean => {
    if (!this.isDataLoaded) { return false; }
    if (!this.restSupportEffectivePerms) { return true; }

    const attrPerm = this.getAttributePermission(entityName, attrName);

    if (attrPerm === 'DENY') {
      return false;
    }
    if (attrPerm === 'MODIFY') {
      return true;
    }
    return requiredAttrPerm === 'VIEW';
  }

  /**
   * Returns a boolean indicating whether a given specific permission is granted
   * to the current user.
   *
   * @param target
   */
  isSpecificPermissionGranted = (target: string): boolean => {
    if (!this.isDataLoaded) { return false; }
    if (!this.restSupportEffectivePerms) { return true; }

    return isSpecificPermissionGranted(target, this.effectivePermissions);
  }

  @action loadPermissions(): Promise<void> {
    const requestId = ++this.permissionsRequestCount;
    this.effectivePermissions = undefined;
    this.attrPermissionCache.clear();

    return this.cubaREST.getEffectivePermissions()
      .then(action((effectivePermsInfo: EffectivePermsInfo) => {
        if (requestId === this.permissionsRequestCount) {
          this.effectivePermissions = effectivePermsInfo;
        }
      }))
      .catch((error: CubaRestError) => {
        // support rest api version < 7.2
        if (error.message === CubaApp.NOT_SUPPORTED_BY_API_VERSION) {
          this.restSupportEffectivePerms = false;
        } else {
          throw error;
        }
      });
  }

}
