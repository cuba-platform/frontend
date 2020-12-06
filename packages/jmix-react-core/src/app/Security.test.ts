import { Security } from './Security';
import {EffectivePermsInfo, EntityPermissionValue, Permission, AttributePermissionValue} from '@cuba-platform/rest';

describe('Security service', () => {
  describe('Security#canUploadAndLinkFile()', () => {
    it('should return true when all permissions are granted explicitly', async () => {
      expect((await createSecurityWithLoadedPerms()).canUploadAndLinkFile()).toBe(true);
    });

    it('should return false when create file descriptor permission is denied', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [{target: 'sys$FileDescriptor:create', value: 0}]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return false when create file descriptor permission is undefined and undefined policy is DENY', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: []
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return true when create file descriptor permission is undefined and undefined policy is ALLOW', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [],
        undefinedPermissionPolicy: 'ALLOW'
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all file descriptor permissions (sys$FileDescriptor:*) are granted', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [{target: 'sys$FileDescriptor:*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all entity create permissions (*:create) are granted', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [{target: '*:create', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all entity permissions (*:*) are granted', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [{target: '*:*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return false when upload permission is denied', async () => {
      expect((await createSecurityWithLoadedPerms({
        specific: [{target: 'cuba.restApi.fileUpload.enabled', value: 0}]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return false when upload permission is undefined, undefined policy is DENY', async () => {
      expect((await createSecurityWithLoadedPerms({
        specific: []
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return true when upload permission is undefined, undefined policy is ALLOW', async () => {
      expect((await createSecurityWithLoadedPerms({
        specific: [],
        undefinedPermissionPolicy: 'ALLOW'
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all specific permissions are granted', async () => {
      expect((await createSecurityWithLoadedPerms({
        specific: [{target: '*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should consider entity permissions priority as "from more explicit to less explicit",' +
      ' i.e.: "scr$Car:read" > "scr$Car:*" > "*:read" > "*:*', async () => {
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 1}
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 1},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 1},
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 1},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 1},
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurityWithLoadedPerms({
        entities: [
          {target: '*:*', value: 1},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should consider specific permissions priority as "explicit permission" > "wildcard"', async () => {
      expect((await createSecurityWithLoadedPerms({
        specific: [
          {target: '*', value: 1},
          {target: 'cuba.restApi.fileUpload.enabled', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurityWithLoadedPerms({
        specific: [
          {target: '*', value: 0},
          {target: 'cuba.restApi.fileUpload.enabled', value: 1}
        ]
      })).canUploadAndLinkFile()).toBe(true);
    });
  });

  describe('Security#isOperationPermissionGranted()', () => {
    it('should return false if permissions are not loaded', async () => {
      expect((await createSecurity())
        .isOperationPermissionGranted('sys$FileDescriptor', 'create'))
        .toBe(false);
    });

    it('should return true if permission is granted', async () => {
      expect((await createSecurityWithLoadedPerms())
        .isOperationPermissionGranted('sys$FileDescriptor', 'create'))
        .toBe(true);
    });

    it('should return false if permission is not granted', async () => {
      expect((await createSecurityWithLoadedPerms())
        .isOperationPermissionGranted('scr$Car', 'create'))
        .toBe(false);
    });
  });

  describe('Security#isAttributePermissionGranted()', () => {
    it('should return false if permissions are not loaded', async () => {
      expect((await createSecurity())
        .isAttributePermissionGranted('scr$Car', 'name', 'VIEW'))
        .toBe(false);
    });

    it('should return true if permission is granted', async () => {
      expect((await createSecurityWithLoadedPerms({
        entityAttributes: [{
          target: 'scr$Car:name',
          value: 1
        }]
      }))
        .isAttributePermissionGranted('scr$Car', 'name', 'VIEW'))
        .toBe(true);
    });

    it('should return false if permission is not granted', async () => {
      expect((await createSecurityWithLoadedPerms())
        .isAttributePermissionGranted('scr$Car', 'name', 'VIEW'))
        .toBe(false);
    });
  });

  describe('Security#isSpecificPermissionGranted()', () => {
    it('should return false if permissions are not loaded', async () => {
      expect((await createSecurity())
        .isSpecificPermissionGranted('cuba.restApi.fileUpload.enabled'))
        .toBe(false);
    });

    it('should return true if permission is granted', async () => {
      expect((await createSecurityWithLoadedPerms())
        .isSpecificPermissionGranted('cuba.restApi.fileUpload.enabled'))
        .toBe(true);
    });

    it('should return false if permission is not granted', async () => {
      expect((await createSecurityWithLoadedPerms())
        .isSpecificPermissionGranted('some.permission.that.is.not.granted'))
        .toBe(false);
    });
  });
});

type PermsMockConfig = {
  entities?: Array<Permission<EntityPermissionValue>>,
  entityAttributes?: Array<Permission<AttributePermissionValue>>,
  specific?: Array<Permission<EntityPermissionValue>>,
  undefinedPermissionPolicy?: 'ALLOW' | 'DENY'
};

async function createSecurityWithLoadedPerms(permsMockConfig?: PermsMockConfig): Promise<Security> {
  const security = await createSecurity(permsMockConfig);
  await security.loadPermissions();
  return security;
}

async function createSecurity(permsMockConfig?: PermsMockConfig): Promise<Security> {
  const cubaREST = jest.genMockFromModule<any>('@cuba-platform/rest').CubaApp;
  cubaREST.getEffectivePermissions = jest.fn(() => createPerms(permsMockConfig));
  return new Security(cubaREST);
}

function createPerms(
  {entities, entityAttributes, specific, undefinedPermissionPolicy}: PermsMockConfig = {}
): Promise<EffectivePermsInfo> {
  return Promise.resolve({
    explicitPermissions: {
      entities: entities ?? [{target: 'sys$FileDescriptor:create', value: 1}],
      entityAttributes: entityAttributes ?? [],
      specific: specific ?? [{target: 'cuba.restApi.fileUpload.enabled', value: 1}],
    },
    undefinedPermissionPolicy: undefinedPermissionPolicy ?? 'DENY'
  });
}
