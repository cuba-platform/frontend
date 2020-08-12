import { Security } from './Security';
import {EffectivePermsInfo, EntityPermissionValue, Permission} from '@cuba-platform/rest';

describe('Security service', () => {
  describe('Security#canUploadAndLinkFile()', () => {
    it('should return true when all permissions are granted explicitly', async () => {
      expect((await createSecurity()).canUploadAndLinkFile()).toBe(true);
    });

    it('should return false when create file descriptor permission is denied', async () => {
      expect((await createSecurity({
        entities: [{target: 'sys$FileDescriptor:create', value: 0}]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return false when create file descriptor permission is undefined and undefined policy is DENY', async () => {
      expect((await createSecurity({
        entities: []
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return true when create file descriptor permission is undefined and undefined policy is ALLOW', async () => {
      expect((await createSecurity({
        entities: [],
        undefinedPermissionPolicy: 'ALLOW'
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all file descriptor permissions (sys$FileDescriptor:*) are granted', async () => {
      expect((await createSecurity({
        entities: [{target: 'sys$FileDescriptor:*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all entity create permissions (*:create) are granted', async () => {
      expect((await createSecurity({
        entities: [{target: '*:create', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all entity permissions (*:*) are granted', async () => {
      expect((await createSecurity({
        entities: [{target: '*:*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return false when upload permission is denied', async () => {
      expect((await createSecurity({
        specific: [{target: 'cuba.restApi.fileUpload.enabled', value: 0}]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return false when upload permission is undefined, undefined policy is DENY', async () => {
      expect((await createSecurity({
        specific: []
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should return true when upload permission is undefined, undefined policy is ALLOW', async () => {
      expect((await createSecurity({
        specific: [],
        undefinedPermissionPolicy: 'ALLOW'
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should return true when all specific permissions are granted', async () => {
      expect((await createSecurity({
        specific: [{target: '*', value: 1}]
      })).canUploadAndLinkFile()).toBe(true);
    });

    it('should consider entity permissions priority as "from more explicit to less explicit",' +
      ' i.e.: "scr$Car:read" > "scr$Car:*" > "*:read" > "*:*', async () => {
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 1}
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 1},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 1},
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 1},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 0},
          {target: '*:create', value: 1},
        ]
      })).canUploadAndLinkFile()).toBe(true);
      expect((await createSecurity({
        entities: [
          {target: '*:*', value: 1},
          {target: '*:create', value: 0},
          {target: 'sys$FileDescriptor:*', value: 0},
          {target: 'sys$FileDescriptor:create', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
    });

    it('should consider specific permissions priority as "explicit permission" > "wildcard"', async () => {
      expect((await createSecurity({
        specific: [
          {target: '*', value: 1},
          {target: 'cuba.restApi.fileUpload.enabled', value: 0}
        ]
      })).canUploadAndLinkFile()).toBe(false);
      expect((await createSecurity({
        specific: [
          {target: '*', value: 0},
          {target: 'cuba.restApi.fileUpload.enabled', value: 1}
        ]
      })).canUploadAndLinkFile()).toBe(true);
    });
  });
});

type PermsMockConfig = {
  entities?: Array<Permission<EntityPermissionValue>>,
  specific?: Array<Permission<EntityPermissionValue>>,
  undefinedPermissionPolicy?: 'ALLOW' | 'DENY'
};

async function createSecurity(permsMockConfig?: PermsMockConfig): Promise<Security> {
  const cubaREST = jest.genMockFromModule<any>('@cuba-platform/rest').CubaApp;
  cubaREST.getEffectivePermissions = jest.fn(() => createPerms(permsMockConfig));
  const security = new Security(cubaREST);
  await security.loadPermissions();
  return security;
}

function createPerms({entities, specific, undefinedPermissionPolicy}: PermsMockConfig = {}): Promise<EffectivePermsInfo> {
  return Promise.resolve({
    explicitPermissions: {
      entities: entities ?? [{target: 'sys$FileDescriptor:create', value: 1}],
      entityAttributes: [],
      specific: specific ?? [{target: 'cuba.restApi.fileUpload.enabled', value: 1}],
    },
    undefinedPermissionPolicy: undefinedPermissionPolicy ?? 'DENY'
  });
}
