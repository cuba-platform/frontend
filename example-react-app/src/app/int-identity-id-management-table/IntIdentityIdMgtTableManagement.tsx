import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import IntIdentityIdMgtTableEdit from "./IntIdentityIdMgtTableEdit";
import IntIdentityIdMgtTableBrowse from "./IntIdentityIdMgtTableBrowse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@haulmont/jmix-react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class IntIdentityIdMgtTableManagement extends React.Component<Props> {
  static PATH = "/intIdentityIdMgtTableManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <IntIdentityIdMgtTableEdit entityId={entityId} />
    ) : (
      <IntIdentityIdMgtTableBrowse />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("intIdentityIdMgtTableManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
