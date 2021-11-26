import { expect } from "chai";

export async function expectRejectedPromise(promiseCallback: () => Promise<any>, errorMessage?: string) {
  try {
    await promiseCallback();
    expect.fail('The promise is fulfilled');
  } catch (err: any) {
    if (errorMessage != null) {
      expect(err.message).to.equal(errorMessage);
    }
    return;
  }
}
