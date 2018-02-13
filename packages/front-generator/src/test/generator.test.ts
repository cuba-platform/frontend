import {getLocalClients} from "../generator";
import * as assert from "assert";


describe('generator', function () {
  it(getLocalClients.name, async function() {
    assert(Array.isArray(await getLocalClients()));
  })
});