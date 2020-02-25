import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import CarEdit from "./CarEdit";
import CarCards from "./CarCards";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  parsePagingParams,
  defaultPagingConfig
} from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class CarManagement extends React.Component<Props> {
  static PATH = "/carManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    const { search } = this.props.location;
    const { current, pageSize } = this.paginationConfig;
    this.paginationConfig = {
      ...this.paginationConfig,
      ...parsePagingParams(search, current, pageSize)
    };
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? <CarEdit entityId={entityId} /> : <CarCards />;
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("carManagement2", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
