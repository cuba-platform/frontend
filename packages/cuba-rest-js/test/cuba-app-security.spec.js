"use strict";

const expect = require('chai').expect;
const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');

describe('CubaApp security methods', () => {

  const apiUrl = 'http://localhost:8080/app/rest/';
  let app;

  it('should load effective perms for admin', async () => {

    const expectedAdminEffectivePerms = {
      explicitPermissions: {entities: [], entityAttributes: [], specific: []},
      defaultValues:
        {
          entityCreate: 1,
          entityRead: 1,
          entityUpdate: 1,
          entityDelete: 1,
          entityAttribute: 2,
          specific: 1
        },
      undefinedPermissionPolicy: "DENY"
    };

    app = new cuba.CubaApp('', apiUrl);
    await app.login('admin', 'admin');
    expect(await app.getEffectivePermissions()).eql(expectedAdminEffectivePerms);
  });

  it('should load effective perms for mechanic', async () => {

    app = new cuba.CubaApp('', apiUrl);
    await app.login('mechanic', '1');
    const perms = await app.getEffectivePermissions();

    expect(perms.undefinedPermissionPolicy).eq("DENY");

    expect(perms.defaultValues).eql(
      {
        entityCreate: 0,
        entityRead: 0,
        entityUpdate: 0,
        entityDelete: 0,
        entityAttribute: 0,
        specific: 0
      });

    expect(perms.explicitPermissions.entities).include.all.deep.members([
      {target: 'scr$Car:read', value: 1},
      {target: 'scr$Car:create', value: 1},
      {target: 'scr$Car:update', value: 1},
      {target: 'scr$Car:delete', value: 1}
    ]);

    expect(perms.explicitPermissions.entityAttributes).include.all.deep.members([
      {target: 'scr$Car:carType', value: 2},
      {target: 'scr$Car:mileage', value: 1},
      {target: 'scr$Car:model', value: 2},
      {target: 'scr$Car:manufacturer', value: 2}
    ]);
  });

  it('should load effective perms for manager', async () => {

    app = new cuba.CubaApp('', apiUrl);
    await app.login('manager', '2');
    const perms = await app.getEffectivePermissions();
    console.dir(perms, {depth: null});

    expect(perms.undefinedPermissionPolicy).eq("DENY");

    expect(perms.defaultValues).eql(
      {
        entityCreate: 0,
        entityRead: 0,
        entityUpdate: 0,
        entityDelete: 0,
        entityAttribute: 0,
        specific: 0
      });

    expect(perms.explicitPermissions.entities).include.all.deep.members([
      {target: 'scr$Car:read', value: 1},
      {target: 'scr$Car:create', value: 1},
      {target: 'scr$Car:update', value: 1},
      {target: 'scr$Car:delete', value: 1}
    ]);

    expect(perms.explicitPermissions.entityAttributes).include.all.deep.members([
      {target: 'scr$Car:carType', value: 2},
      {target: 'scr$Car:regNumber', value: 2},
      {target: 'scr$Car:model', value: 2},
      {target: 'scr$Car:manufacturer', value: 2}
    ]);
  });

});