import {exportList} from "../list";
import {promisify} from "util";
import {GeneratedClientInfo} from "../init";
import * as fs from "fs";
import {expect} from "chai";

const rimraf = promisify(require('rimraf'));

const SAVE_CLIENTS_DIR = './src/test/generated/client-list';

const client = '' + `
  {
    "bundled": true,
    "name": "react-typescript",
    "bower": false,
    "clientBaseTech": "React",
    "generators": [
      {
        "name": "app",
        "options": {
          "dest": {
            "alias": "d",
            "description": "destination directory"
          },
          "model": {
            "alias": "m",
            "description": "specify path to project model, if given no interactive prompt will be invoked"
          }
        },
        "params": []
      },
      {
        "name": "blank-component",
        "options": {
          "dest": {
            "alias": "d",
            "description": "destination directory"
          },
          "model": {
            "alias": "m",
            "description": "specify path to project model, if given no interactive prompt will be invoked"
          },
          "dirShift": {
            "alias": "ds",
            "description": "directory shift for html imports e.g ../../"
          },
          "answers": {
            "alias": "a",
            "description": "fulfilled params for generator to avoid interactive input in serialized JSON string"
          }
        },
        "params": [
          {
            "caption": "Component class name",
            "code": "componentName",
            "propertyType": "POLYMER_COMPONENT_NAME",
            "required": true
          }
        ],
        "description": "Empty React class-based component"
      },
      {
        "name": "entity-cards",
        "options": {
          "dest": {
            "alias": "d",
            "description": "destination directory"
          },
          "model": {
            "alias": "m",
            "description": "specify path to project model, if given no interactive prompt will be invoked"
          },
          "dirShift": {
            "alias": "ds",
            "description": "directory shift for html imports e.g ../../"
          },
          "answers": {
            "alias": "a",
            "description": "fulfilled params for generator to avoid interactive input in serialized JSON string"
          }
        },
        "params": [
          {
            "caption": "Entity",
            "code": "entity",
            "propertyType": "ENTITY",
            "required": true
          },
          {
            "caption": "Component class name",
            "code": "componentName",
            "propertyType": "POLYMER_COMPONENT_NAME",
            "defaultValue": "Cards",
            "required": true
          },
          {
            "caption": "Entity view",
            "code": "entityView",
            "propertyType": "VIEW",
            "relatedProperty": "entity",
            "required": true
          }
        ],
        "description": "Read-only list of entities displayed as cards"
      },
      {
        "name": "entity-management",
        "options": {
          "dest": {
            "alias": "d",
            "description": "destination directory"
          },
          "model": {
            "alias": "m",
            "description": "specify path to project model, if given no interactive prompt will be invoked"
          },
          "dirShift": {
            "alias": "ds",
            "description": "directory shift for html imports e.g ../../"
          },
          "answers": {
            "alias": "a",
            "description": "fulfilled params for generator to avoid interactive input in serialized JSON string"
          }
        },
        "params": [
          {
            "code": "entity",
            "caption": "Entity",
            "propertyType": "ENTITY",
            "required": true
          },
          {
            "code": "managementComponentName",
            "caption": "CRUD component class",
            "propertyType": "POLYMER_COMPONENT_NAME",
            "defaultValue": "Management",
            "required": true
          },
          {
            "code": "listType",
            "caption": "List type",
            "propertyType": "OPTION",
            "defaultValue": "cards",
            "required": true,
            "options": [
              "cards",
              "list"
            ]
          },
          {
            "code": "listComponentName",
            "caption": "List component class",
            "propertyType": "POLYMER_COMPONENT_NAME",
            "defaultValue": "List",
            "required": true
          },
          {
            "code": "listView",
            "caption": "List view",
            "propertyType": "VIEW",
            "relatedProperty": "entity",
            "required": true
          },
          {
            "code": "editComponentName",
            "caption": "Edit component class name",
            "propertyType": "POLYMER_COMPONENT_NAME",
            "defaultValue": "Edit",
            "required": true
          },
          {
            "code": "editView",
            "caption": "Edit view",
            "propertyType": "VIEW",
            "relatedProperty": "entity",
            "required": true
          }
        ],
        "description": "CRUD (list + editor) screens for specified entity"
      }
    ]
  }
`;

describe('export client list', function () {

  before(() => rimraf(SAVE_CLIENTS_DIR));

  it('should export client list, if --save param set', function () {
    const clients: GeneratedClientInfo[] = [];
    clients.push(JSON.parse(client));
    exportList(clients, {save: SAVE_CLIENTS_DIR + '/available-clients.json'});

    const res = fs.readFileSync(`${SAVE_CLIENTS_DIR}/available-clients.json`, 'utf8');
    expect(res.length).to.eq(3093);
  });

});