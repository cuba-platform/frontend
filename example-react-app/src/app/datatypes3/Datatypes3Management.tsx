import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import Datatypes3Edit from "./Datatypes3Edit";
import Datatypes3Browse from "./Datatypes3Browse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@haulmont/jmix-react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class Datatypes3Management extends React.Component<Props> {
  static PATH = "/datatypes3Management";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <Datatypes3Edit entityId={entityId} />
    ) : (
      <Datatypes3Browse />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("datatypes3Management", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
