import {action, computed, observable, ObservableMap} from 'mobx';
import {CubaApp, EntityAttrPermissionValue, EffectivePermsInfo} from '@cuba-platform/rest';
import {getAttributePermission} from '@cuba-platform/rest/dist-node/security';

export class Security {

  @observable attrPermissionCache: ObservableMap<string, EntityAttrPermissionValue> = new ObservableMap();
  @observable effectivePermissions?: EffectivePermsInfo;
  @observable private restSupportEffectivePerms: boolean = true;
  permissionsRequestCount = 0;

  constructor(private cubaREST: CubaApp) {
  }

  @computed get isDataLoaded(): boolean {
    return this.effectivePermissions != null || !this.restSupportEffectivePerms;
  };

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

  @action loadPermissions() {
    const requestId = ++this.permissionsRequestCount;
    this.effectivePermissions = undefined;
    this.attrPermissionCache.clear();

    this.cubaREST.getEffectivePermissions()
      .then(action((effectivePermsInfo: EffectivePermsInfo) => {
        if (requestId === this.permissionsRequestCount) {
          this.effectivePermissions = effectivePermsInfo;
        }
      }))
      .catch(reason => {
        // support rest api version < 7.2
        if (reason === CubaApp.NOT_SUPPORTED_BY_API_VERSION) {
          this.restSupportEffectivePerms = false;
        } else {
          throw reason;
        }
      });
  }

}
