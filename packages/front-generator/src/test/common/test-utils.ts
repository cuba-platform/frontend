import { expect } from "chai";

export async function expectRejectedPromise(promiseCallback: () => Promise<any>, errorMessage?: string) {
  try {
    await promiseCallback();
  } catch (err) {
    if (errorMessage != null) {
      expect(err.message).to.equal(errorMessage);
    }
    return;
  }
}