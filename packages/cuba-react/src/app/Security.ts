import {action, IObservableArray, observable, ObservableMap} from 'mobx';
import {CubaApp, EntityAttrPermissionValue, PermissionInfo, RoleInfo, RolesInfo} from '@cuba-platform/rest';
import {getAttributePermission} from '@cuba-platform/rest/dist-node/security';
import {matchesVersion} from '@cuba-platform/rest/dist-node/util';

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

  @action
  async loadPermissions() {

    await this.cubaREST.refreshApiVersion();

    const requestId = ++this.permissionsRequestCount;

    if (matchesVersion(this.cubaREST.apiVersion, '7.2')) {
      const rolesInfo: RolesInfo = await this.cubaREST.getRoles();
      if (requestId === this.permissionsRequestCount) {
        this.permissions = observable(rolesInfo.permissions);
        this.roles = observable(rolesInfo.roles);
        this.attrPermissionCache.clear();
      }

    } else {
      const permissions: PermissionInfo[] = await this.cubaREST.getPermissions();
      if (requestId === this.permissionsRequestCount) {
        this.permissions = observable(permissions);
      }
    }

  }

}
