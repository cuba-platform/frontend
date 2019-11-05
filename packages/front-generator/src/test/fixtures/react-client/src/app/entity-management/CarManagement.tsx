import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import CarEdit from "./CarEdit";
import CarCards from "./CarCards";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class CarManagement extends React.Component<Props> {
  static PATH = "/carManagement";
  static NEW_SUBPATH = "new";

  render() {
    const { entityId } = this.props.match.params;
    return <>{entityId ? <CarEdit entityId={entityId} /> : <CarCards />}</>;
  }
}
