"use strict";

const cuba = require('../dist-node/cuba.js');
const {initApp} = require('./common');

global.fetch = require('node-fetch');

xdescribe('CubaApp security methods', () => {

  const apiUrl = 'http://localhost:8080/app/rest/';
  let app;

  it('should load effective perms for admin', async () => {

    const expectedAdminEffectivePerms = {
      explicitPermissions: {
        entities: [
          {target: '*:update', value: 1},
          {target: '*:read', value: 1},
          {target: '*:delete', value: 1},
          {target: '*:create', value: 1}
        ],
        entityAttributes: [{target: '*:*', value: 2}],
        specific: [{target: '*', value: 1}]
      },
      undefinedPermissionPolicy: 'DENY'
    };

    app = initApp();
    await app.login('admin', 'admin');
    expect(await app.getEffectivePermissions()).toEqual(expectedAdminEffectivePerms);
  });

  it('should load effective perms for mechanic', async () => {

    app = initApp();
    await app.login('mechanic', '1');
    const perms = await app.getEffectivePermissions();

    expect(perms.undefinedPermissionPolicy).toBe("DENY");

    expect(perms.explicitPermissions.entities).toEqual(expect.arrayContaining([
      {target: 'scr$Car:read', value: 1},
      {target: 'scr$Car:create', value: 1},
      {target: 'scr$Car:update', value: 1},
      {target: 'scr$Car:delete', value: 1}
    ]));

    expect(perms.explicitPermissions.entityAttributes).toEqual(expect.arrayContaining([
      {target: 'scr$Car:carType', value: 2},
      {target: 'scr$Car:mileage', value: 1},
      {target: 'scr$Car:model', value: 2},
      {target: 'scr$Car:manufacturer', value: 2}
    ]));

    expect(perms.explicitPermissions.specific).toEqual(expect.arrayContaining([
      { target: 'cuba.gui.loginToClient', value: 1 },
      { target: 'cuba.restApi.enabled', value: 1 },
      { target: 'cuba.restApi.fileUpload.enabled', value: 1 }
    ]));
  });

  it('should load effective perms for manager', async () => {

    app = initApp();
    await app.login('manager', '2');
    const perms = await app.getEffectivePermissions();

    expect(perms.undefinedPermissionPolicy).toBe("DENY");

    expect(perms.explicitPermissions.entities).toEqual(expect.arrayContaining([
      {target: 'scr$Car:read', value: 1},
      {target: 'scr$Car:create', value: 1},
      {target: 'scr$Car:update', value: 1},
      {target: 'scr$Car:delete', value: 1}
    ]));

    expect(perms.explicitPermissions.entityAttributes).toEqual(expect.arrayContaining([
      {target: 'scr$Car:carType', value: 2},
      {target: 'scr$Car:regNumber', value: 2},
      {target: 'scr$Car:model', value: 2},
      {target: 'scr$Car:manufacturer', value: 2}
    ]));

    expect(perms.explicitPermissions.specific).toEqual(expect.arrayContaining([
      { target: 'cuba.gui.loginToClient', value: 1 },
      { target: 'cuba.restApi.enabled', value: 1 },
      { target: 'cuba.restApi.fileUpload.enabled', value: 1 }
    ]));
  });

});