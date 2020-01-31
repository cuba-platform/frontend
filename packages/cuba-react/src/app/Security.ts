import {action, IObservableArray, observable, ObservableMap} from 'mobx';
import {CubaApp, EntityAttrPermissionValue, PermissionInfo, RoleInfo} from '@cuba-platform/rest';
import {getAttributePermission} from '@cuba-platform/rest/dist-node/security';

export class Security {

  @observable permissions?: IObservableArray<PermissionInfo>;
  @observable attrPermissionCache: ObservableMap<string, EntityAttrPermissionValue> = new ObservableMap();
  @observable roles?: IObservableArray<RoleInfo>;
  permissionsRequestCount = 0;

  constructor(private cubaREST: CubaApp) {
  }

  getAttributePermission = (entityName: string, attributeName: string): EntityAttrPermissionValue => {

    // do not check permissions if roles not set (rest api version prev 7.2)
    if (!this.roles) return 'MODIFY';

    const attrFqn = `${entityName}:${attributeName}`;

    let perm = this.attrPermissionCache.get(attrFqn);
    if (perm != null) return perm;

    perm = getAttributePermission(entityName, attributeName, this.permissions, this.roles);
    this.attrPermissionCache.set(attrFqn, perm);
    return perm;
  };

  @action loadPermissions() {
    const requestId = ++this.permissionsRequestCount;
    this.cubaREST.getPermissions()
      .then(action((perms: PermissionInfo[]) => {
        if (requestId === this.permissionsRequestCount) {
          this.permissions = observable(perms);
        }
      }));
  }
}
