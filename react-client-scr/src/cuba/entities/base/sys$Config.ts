import { BaseUuidEntity } from "./sys$BaseUuidEntity";
export class Config extends BaseUuidEntity {
  static NAME = "sys$Config";
  version?: number | null;
  createTs?: any | null;
  createdBy?: string | null;
  updateTs?: any | null;
  updatedBy?: string | null;
  name?: string | null;
  value?: string | null;
}
export type ConfigViewName = "_base" | "_local" | "_minimal" | "appProperties";
export type ConfigView<V extends ConfigViewName> = V extends "_base"
  ? Pick<Config, "id" | "name" | "value">
  : V extends "_local"
  ? Pick<Config, "id" | "name" | "value">
  : V extends "appProperties"
  ? Pick<
      Config,
      | "id"
      | "version"
      | "createTs"
      | "createdBy"
      | "updateTs"
      | "updatedBy"
      | "name"
      | "value"
    >
  : never;
