import {collectClients} from "../init";
import * as assert from "assert";

describe('generator', function () {
  it(collectClients.name, async function () {
    const generators = collectClients();
    assert(Array.isArray(generators));
    console.log(generators.reduce((p, gen) => p + gen.name + '\n', ''));
  });

});

