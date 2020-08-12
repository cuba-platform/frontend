const security = require('../dist-node/security');

describe('security', () => {
  it('should return correct attribute permission', () => {

    expect(security.getAttributePermission('scr$Car', 'mileage', undefined))
      .toBe('DENY');

    const perms = {
      explicitPermissions: {entities: [], entityAttributes: [], specific: []},
      undefinedPermissionPolicy: 'ALLOW'
    };
    expect(security.getAttributePermission('scr$Car', 'mileage', perms))
      .toBe('MODIFY');

    perms.undefinedPermissionPolicy = 'DENY';
    expect(security.getAttributePermission('scr$Car', 'mileage', perms))
      .toBe('DENY');

    perms.explicitPermissions.entityAttributes.push({target: '*:*', value: 1});
    expect(security.getAttributePermission('scr$Car', 'mileage', perms))
      .toBe('VIEW');

    perms.explicitPermissions.entityAttributes.push({target: 'scr$Car:*', value: 2});
    expect(security.getAttributePermission('scr$Car', 'mileage', perms))
      .toBe('MODIFY');

    perms.explicitPermissions.entityAttributes.push({target: 'scr$Car:mileage', value: 0});
    expect(security.getAttributePermission('scr$Car', 'mileage', perms))
      .toBe('DENY');
  });

  it('should define if operation allowed or not', function () {
    expect(security.isOperationAllowed('scr$Car', 'read', undefined))
      .toBe(false);

    const perms = {
      explicitPermissions: {entities: [], entityAttributes: [], specific: []},
      undefinedPermissionPolicy: 'ALLOW'
    };
    expect(security.isOperationAllowed('scr$Car', 'read', perms))
      .toBe(true);

    perms.explicitPermissions.entities.push({target: '*:*', value: 0});
    expect(security.isOperationAllowed('scr$Car', 'read', perms))
      .toBe(false);

    perms.explicitPermissions.entities.push({target: 'scr$Car:*', value: 1});
    expect(security.isOperationAllowed('scr$Car', 'read', perms))
      .toBe(true);

    perms.explicitPermissions.entities.push({target: 'scr$Car:read', value: 0});
    expect(security.isOperationAllowed('scr$Car', 'read', perms))
      .toBe(false);

    perms.explicitPermissions.entities = [
      {target: 'scr$Car:read', value: 1},
      {target: 'scr$Car:create', value: 0},
      {target: 'scr$Car:update', value: 0},
      {target: 'scr$Car:delete', value: 0}
    ];
    expect(security.isOperationAllowed('scr$Car', 'read', perms))
      .toBe(true);

  });

  describe('isSpecificPermissionGranted()', () => {
    const PERM_NAME = 'cuba.restApi.fileUpload.enabled';
    let perms;

    beforeEach(() => {
      perms = {
        explicitPermissions: {
          entities: [],
          entityAttributes: [],
          specific: []
        },
        undefinedPermissionPolicy: 'DENY'
      };
    });

    it('should return false for null or undefined perms', () => {
      expect(security.isSpecificPermissionGranted(PERM_NAME, null)).toBe(false);
      expect(security.isSpecificPermissionGranted(PERM_NAME, undefined)).toBe(false);
    });

    it('should return false if no permission is given', () => {
      expect(security.isSpecificPermissionGranted(PERM_NAME, perms)).toBe(false);
    });

    it('should return true if wildcard permission is granted', () => {
      perms.explicitPermissions.specific = [
        {target: '*', value: 1}
      ];
      expect(security.isSpecificPermissionGranted(PERM_NAME, perms)).toBe(true);
    });

    it('should return true if explicit permission is granted', () => {
      perms.explicitPermissions.specific = [
        {target: PERM_NAME, value: 1}
      ];
      expect(security.isSpecificPermissionGranted(PERM_NAME, perms)).toBe(true);
    });

    it('should prefer explicit permission to wildcard', () => {
      perms.explicitPermissions.specific = [
        {target: '*', value: 0},
        {target: PERM_NAME, value: 1}
      ];
      expect(security.isSpecificPermissionGranted(PERM_NAME, perms)).toBe(true);
    });
  });
});