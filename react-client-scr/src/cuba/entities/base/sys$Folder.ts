import { StandardEntity } from "./sys$StandardEntity";
export class Folder extends StandardEntity {
  static NAME = "sys$Folder";
  parent?: Folder | null;
  name?: string | null;
  sortOrder?: number | null;
  tabName?: string | null;
  sysTenantId?: string | null;
}
export type FolderViewName = "_base" | "_local" | "_minimal";
export type FolderView<V extends FolderViewName> = V extends "_base"
  ? Pick<Folder, "id" | "name" | "sortOrder" | "tabName" | "sysTenantId">
  : V extends "_local"
  ? Pick<Folder, "id" | "name" | "sortOrder" | "tabName" | "sysTenantId">
  : never;
