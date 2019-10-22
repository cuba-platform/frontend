import {collectClients} from "../init";
import {expect} from "chai";
import * as fs from "fs";

describe('init', function () {
  it('should collect clients', function () {
    const clients = collectClients('index.ts').sort((a, b) => {return a.name.localeCompare(b.name)});
    expect(clients.length).to.eq(4);

    const genCountOfClient: Map<string, number> = new Map();
    genCountOfClient.set('polymer2', 9);
    genCountOfClient.set('polymer2-typescript', 6);
    genCountOfClient.set('react-typescript', 4);
    genCountOfClient.set('sdk', 2);

    genCountOfClient.forEach((num, client) =>
        expect(clients.find(c => c.name == client)!.generators.length).eq(num));
  });
});