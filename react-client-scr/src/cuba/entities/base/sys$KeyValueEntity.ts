export class KeyValueEntity {
  static NAME = "sys$KeyValueEntity";
}
export type KeyValueEntityViewName = "_base" | "_local" | "_minimal";
export type KeyValueEntityView<V extends KeyValueEntityViewName> = never;
