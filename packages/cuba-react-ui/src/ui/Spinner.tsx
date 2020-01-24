import React from 'react';
import {Spin} from "antd";

export function Spinner() {

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <Spin size="large"/>
    </div>
  );

}