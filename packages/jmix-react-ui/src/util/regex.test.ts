import {uuidPattern} from "./regex";

describe('UUID regex', () => {
  it('should match valid UUID', () => {
    expect('6c85d42d-6ffb-4f23-b9b4-ef46eeb82d98'.match(uuidPattern)).toBeTruthy();
    expect('2f63bf04-baa0-4a5b-adcf-5388724bc2bc'.match(uuidPattern)).toBeTruthy();
    expect('89FE53CD-6390-4054-8239-B9F78BF8D348'.match(uuidPattern)).toBeTruthy();
  });
  it('should not match invalid UUID', () => {
    expect('1mskirm3-3jdk-5j3n-dsf4-5jsncxzsifrw'.match(uuidPattern)).toBeFalsy();
    expect('f63bf04-baa0-4a5b-adcf-5388724bc2bc'.match(uuidPattern)).toBeFalsy();
    expect('2f63bf04baa04a5badcf5388724bc2bc'.match(uuidPattern)).toBeFalsy();
    expect(''.match(uuidPattern)).toBeFalsy();
  });
  it('should match NIL UUID', () => {
    expect('00000000-0000-0000-0000-000000000000'.match(uuidPattern)).toBeTruthy();
  });
});