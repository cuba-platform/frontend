export class EmbeddableEntity {
  static NAME = "sys$EmbeddableEntity";
}
export type EmbeddableEntityViewName = "_base" | "_local" | "_minimal";
export type EmbeddableEntityView<V extends EmbeddableEntityViewName> = never;
