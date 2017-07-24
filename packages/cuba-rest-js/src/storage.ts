export class DefaultStorage implements Storage {

  private items = {};

  get length(): number {
    return Object.keys(this.items).length;
  }

  public clear(): void {
    this.items = {};
  }

  public getItem(key: string): string | any {
    return this.items[key];
  }

  public key(index: number): string | any {
    throw new Error('Unsupported operation');
  }

  public removeItem(key: string): void {
    delete this.items[key];
  }

  public setItem(key: string, data: string): void {
    this.items[key] = data;
  }

  [key: string]: any;
  [index: number]: string;
}
