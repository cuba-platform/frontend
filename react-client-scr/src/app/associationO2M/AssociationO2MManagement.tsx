import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import AssociationO2MEdit from "./AssociationO2MEdit";
import AssociationO2MBrowse from "./AssociationO2MBrowse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class AssociationO2MManagement extends React.Component<Props> {
  static PATH = "/associationO2MManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <AssociationO2MEdit entityId={entityId} />
    ) : (
      <AssociationO2MBrowse />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("associationO2MManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
