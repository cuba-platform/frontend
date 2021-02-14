import { LoadingOutlined } from "@ant-design/icons";
import Centered from "./common/Centered";
import * as React from "react";
import "./CenteredLoader.css";

export class CenteredLoader extends React.Component {
  render() {
    return (
      <Centered>
        <LoadingOutlined className="centered-loader-icon" spin={true} />
      </Centered>
    );
  }
}
