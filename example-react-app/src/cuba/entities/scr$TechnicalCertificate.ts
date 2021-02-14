import { Car } from "./scr$Car";
export class TechnicalCertificate {
  static NAME = "scr$TechnicalCertificate";
  id?: string;
  certNumber?: string | null;
  car?: Car | null;
}
export type TechnicalCertificateViewName =
  | "_base"
  | "_instance_name"
  | "_local";
export type TechnicalCertificateView<
  V extends TechnicalCertificateViewName
> = V extends "_base"
  ? Pick<TechnicalCertificate, "id" | "certNumber">
  : V extends "_local"
  ? Pick<TechnicalCertificate, "id" | "certNumber">
  : never;
