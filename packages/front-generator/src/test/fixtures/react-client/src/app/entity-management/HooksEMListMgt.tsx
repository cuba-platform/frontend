import React, { useCallback } from "react";
import { RouteComponentProps } from "react-router";
import { useLocalStore, useObserver } from "mobx-react";
import HooksEMListEdit from "./HooksEMListEdit";
import HooksEMListBrowse from "./HooksEMListBrowse";
import { action } from "mobx";
import { PaginationConfig } from "antd/es/pagination";
import { addPagingParams, createPagingConfig } from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

type HooksEMListMgtLocalStore = {
  paginationConfig: PaginationConfig;
};

export const PATH = "/hooksEMListMgt";
export const NEW_SUBPATH = "new";

export const HooksEMListMgt = (props: Props) => {
  const { entityId } = props.match.params;

  const store: HooksEMListMgtLocalStore = useLocalStore(() => ({
    paginationConfig: createPagingConfig(props.location.search)
  }));

  const onPagingChange = useCallback(
    action((current: number, pageSize: number) => {
      props.history.push(addPagingParams("hooksEMListMgt", current, pageSize));
      store.paginationConfig = { ...store.paginationConfig, current, pageSize };
    }),
    []
  );

  return useObserver(() => {
    return entityId != null ? (
      <HooksEMListEdit entityId={entityId} />
    ) : (
      <HooksEMListBrowse
        onPagingChange={onPagingChange}
        paginationConfig={store.paginationConfig}
      />
    );
  });
};
