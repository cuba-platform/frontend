export class AbstractNotPersistentEntity {
  static NAME = "sys$AbstractNotPersistentEntity";
  id?: string;
}
export type AbstractNotPersistentEntityViewName =
  | "_base"
  | "_local"
  | "_minimal";
export type AbstractNotPersistentEntityView<
  V extends AbstractNotPersistentEntityViewName
> = never;
