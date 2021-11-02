import { StandardEntity } from "./sys$StandardEntity";
export class JmxInstance extends StandardEntity {
  static NAME = "sys$JmxInstance";
  nodeName?: string | null;
  address?: string | null;
  login?: string | null;
  password?: string | null;
}
export type JmxInstanceViewName = "_base" | "_local" | "_minimal";
export type JmxInstanceView<V extends JmxInstanceViewName> = V extends "_base"
  ? Pick<JmxInstance, "id" | "nodeName" | "address" | "login" | "password">
  : V extends "_local"
  ? Pick<JmxInstance, "id" | "nodeName" | "address" | "login" | "password">
  : V extends "_minimal"
  ? Pick<JmxInstance, "id" | "nodeName" | "address">
  : never;
