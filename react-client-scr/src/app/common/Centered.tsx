import * as React from "react";
import { ReactNode } from "react";
import "./Centered.css";

export default function Centered({ children }: { children?: ReactNode }) {
  return <div className="_centered">{children}</div>;
}
