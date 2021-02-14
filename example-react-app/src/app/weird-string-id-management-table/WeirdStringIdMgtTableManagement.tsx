import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import WeirdStringIdMgtTableEdit from "./WeirdStringIdMgtTableEdit";
import WeirdStringIdMgtTableBrowse from "./WeirdStringIdMgtTableBrowse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@haulmont/jmix-react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class WeirdStringIdMgtTableManagement extends React.Component<Props> {
  static PATH = "/weirdStringIdMgtTableManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <WeirdStringIdMgtTableEdit entityId={entityId} />
    ) : (
      <WeirdStringIdMgtTableBrowse />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("weirdStringIdMgtTableManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
