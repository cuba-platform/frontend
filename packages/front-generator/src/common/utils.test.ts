import { expect } from "chai";
import { normalizeRelativePath } from "./utils";

describe('normalizeRelativePath()', () => {
  it('Replaces the backslashes in the provided path with forward slashes', () => {
    expect(normalizeRelativePath('..\\..\\')).to.equal('../../');
    expect(normalizeRelativePath('..\\..')).to.equal('../../');
  });

  it('Adds a trailing slash if it is missing', () => {
    expect(normalizeRelativePath('../..')).to.equal('../../');
  });

  it('Does not add an additional trailing slash if already present', () => {
    expect(normalizeRelativePath('../../')).to.equal('../../');
  });
});