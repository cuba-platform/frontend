import * as React from "react";
import { RouteComponentProps } from "react-router";
import { observer } from "mobx-react";
import CompositeKeyEntityCardsEdit from "./CompositeKeyEntityCardsEdit";
import CompositeKeyEntityCards from "./CompositeKeyEntityCards";
import { PaginationConfig } from "antd/es/pagination";
import { action, observable } from "mobx";
import {
  addPagingParams,
  createPagingConfig,
  defaultPagingConfig
} from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

@observer
export class CompositeKeyEntityManagement3 extends React.Component<Props> {
  static PATH = "/compositeKeyEntityManagement3";
  static NEW_SUBPATH = "new";

  @observable paginationConfig: PaginationConfig = { ...defaultPagingConfig };

  componentDidMount(): void {
    // to disable paging config pass 'true' as disabled param in function below
    this.paginationConfig = createPagingConfig(this.props.location.search);
  }

  render() {
    const { entityId } = this.props.match.params;
    return entityId ? (
      <CompositeKeyEntityCardsEdit entityId={entityId} />
    ) : (
      <CompositeKeyEntityCards
        onPagingChange={this.onPagingChange}
        paginationConfig={this.paginationConfig}
      />
    );
  }

  @action onPagingChange = (current: number, pageSize: number) => {
    this.props.history.push(
      addPagingParams("compositeKeyEntityManagement3", current, pageSize)
    );
    this.paginationConfig = { ...this.paginationConfig, current, pageSize };
  };
}
