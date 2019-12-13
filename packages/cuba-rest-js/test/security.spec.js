const expect = require('chai').expect;
const security = require('../dist-node/security');

describe('security', function () {
  it('should return correct attribute permission', function () {

    expect(security.getAttributePermission('scr$Car', 'mileage', undefined, undefined)).to.equal('DENY');
    expect(security.getAttributePermission('scr$Car', 'mileage', [], [])).to.equal('MODIFY');

    let perms = [{
      type: "ENTITY_ATTR",
      target: "scr$Car:mileage",
      value: "DENY",
      intValue: 0
    }];

    // we don't disable attr for DENYING role, only for STRICTLY_DENYING
    expect(security.getAttributePermission('scr$Car', 'ecoRank', perms,
      [{roleType: 'DENYING'}]))
      .to.equal('MODIFY');

    // always max permission if SUPER role exist
    expect(security.getAttributePermission('scr$Car', 'mileage', [],
      [{roleType: 'STRICTLY_DENYING'}, {roleType: 'SUPER'}]))
      .to.equal('MODIFY');

    const rolesStrictDeny = [{roleType: 'STRICTLY_DENYING'}];

    expect(security.getAttributePermission('scr$Car', 'mileage', [], rolesStrictDeny))
      .to.equal('DENY');
    expect(security.getAttributePermission('scr$Car', 'mileage', perms, rolesStrictDeny))
      .to.equal('DENY');
    expect(security.getAttributePermission('scr$Car', 'ecoRank', perms, rolesStrictDeny))
      .to.equal('DENY');


    perms = [{
      type: "ENTITY_ATTR",
      target: "scr$Car:mileage",
      value: "VIEW",
      intValue: 0
    }];

    expect(security.getAttributePermission('scr$Car', 'mileage', perms, rolesStrictDeny))
      .to.equal('VIEW');
    expect(security.getAttributePermission('scr$Car', 'ecoRank', perms, rolesStrictDeny))
      .to.equal('DENY');

    perms = [{
      type: "ENTITY_ATTR",
      target: "scr$Car:mileage",
      value: "VIEW",
      intValue: 1
    }, {
      type: "ENTITY_ATTR",
      target: "scr$Car:mileage",
      value: "MODIFY",
      intValue: 2
    }];

    expect(security.getAttributePermission('scr$Car', 'mileage', perms, rolesStrictDeny))
      .to.equal('MODIFY');
    expect(security.getAttributePermission('scr$Car', 'ecoRank', perms, rolesStrictDeny))
      .to.equal('DENY');
  });

  it('should define if operation allowed or not', function () {
    expect(security.isOperationAllowed('scr$Car', 'create', undefined, undefined))
      .to.eq(false);
    expect(security.isOperationAllowed('scr$Car', 'create', [], []))
      .to.eq(true);

    expect(security.isOperationAllowed('scr$Car', 'create', [], []))
      .to.eq(true);
    expect(security.isOperationAllowed('scr$Car', 'create', [],
      [{roleType: 'READONLY'}]))
      .to.eq(false);

    // read op allowed for READONLY role
    expect(security.isOperationAllowed('scr$Car', 'read', [],
      [{roleType: 'READONLY'}]))
      .to.eq(true);

    // op not allowed for DENY\STRICT if permission not exist
    expect(security.isOperationAllowed('scr$Car', 'read', [],
      [{roleType: 'DENYING'}]))
      .to.eq(false);

    expect(security.isOperationAllowed('scr$Car', 'create', [], []))
      .to.eq(true);

    // if has SUPER - allow all
    expect(security.isOperationAllowed('scr$Car', 'create', [],
      [{roleType: 'READONLY'}, {roleType: 'SUPER'}]))
      .to.eq(true);

    let perms = [{
      type: "ENTITY_OP",
      target: "scr$Car:create",
      value: "DENY",
      intValue: 0
    }];
    expect(security.isOperationAllowed('scr$Car', 'create', perms, []))
      .to.eq(false);

    /* roles are ignored if we have allow perm */

    perms = [{
      type: "ENTITY_OP",
      target: "scr$Car:create",
      value: "DENY",
      intValue: 0
    }, {
      type: "ENTITY_OP",
      target: "scr$Car:create",
      value: "ALLOW",
      intValue: 0
    }, {
      type: "ENTITY_OP",
      target: "scr$Car:read",
      value: "ALLOW",
      intValue: 0
    }];
    expect(security.isOperationAllowed('scr$Car', 'create', perms, []))
      .to.eq(true);
    expect(security.isOperationAllowed('scr$Car', 'create', perms,
      [{roleType: 'READONLY'}]))
      .to.eq(true);
    expect(security.isOperationAllowed('scr$Car', 'read', perms,
      [{roleType: 'READONLY'}]))
      .to.eq(true);
    expect(security.isOperationAllowed('scr$Car', 'create', perms,
      [{roleType: 'READONLY'}, {roleType: 'DENYING'}]))
      .to.eq(true);


  });
});
