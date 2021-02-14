import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import WeirdStringIdMgtCardsEdit from "./WeirdStringIdMgtCardsEdit";
import WeirdStringIdMgtCardsBrowse from "./WeirdStringIdMgtCardsBrowse";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@haulmont/jmix-react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class WeirdStringIdMgtCardsManagement extends React.Component<Props> {
  static PATH = "/weirdStringIdMgtCardsManagement";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <WeirdStringIdMgtCardsEdit entityId={entityId} />
    ) : (
      <WeirdStringIdMgtCardsBrowse
        onPagingChange={this.onPagingChange}
        paginationConfig={this.paginationConfig}
      />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("weirdStringIdMgtCardsManagement", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
