import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import StringIdMgtTableEdit from "./StringIdMgtTableEdit";
import StringIdMgtTableBrowse from "./StringIdMgtTableBrowse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@haulmont/jmix-react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class StringIdMgtTableManagement extends React.Component<Props> {
  static PATH = "/stringIdMgtTableManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <StringIdMgtTableEdit entityId={entityId} />
    ) : (
      <StringIdMgtTableBrowse />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("stringIdMgtTableManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
