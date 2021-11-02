import { StandardEntity } from "./base/sys$StandardEntity";
import { Car } from "./scr$Car";
export class TechnicalCertificate extends StandardEntity {
  static NAME = "scr$TechnicalCertificate";
  certNumber?: string | null;
  car?: Car | null;
}
export type TechnicalCertificateViewName = "_base" | "_local" | "_minimal";
export type TechnicalCertificateView<
  V extends TechnicalCertificateViewName
> = V extends "_base"
  ? Pick<TechnicalCertificate, "id" | "certNumber">
  : V extends "_local"
  ? Pick<TechnicalCertificate, "id" | "certNumber">
  : V extends "_minimal"
  ? Pick<TechnicalCertificate, "id" | "certNumber">
  : never;
