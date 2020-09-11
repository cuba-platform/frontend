import React, { useCallback } from "react";
import { RouteComponentProps } from "react-router";
import { useLocalStore, useObserver } from "mobx-react";
import HooksEMCardsEdit from "./HooksEMCardsEdit";
import HooksEMCardsBrowse from "./HooksEMCardsBrowse";
import { action } from "mobx";
import { PaginationConfig } from "antd/es/pagination";
import { addPagingParams, createPagingConfig } from "@cuba-platform/react-ui";

type Props = RouteComponentProps<{ entityId?: string }>;

type HooksEMCardsMgtLocalStore = {
  paginationConfig: PaginationConfig;
};

export const PATH = "/hooksEMCardsMgt";
export const NEW_SUBPATH = "new";

export const HooksEMCardsMgt = (props: Props) => {
  const { entityId } = props.match.params;

  const store: HooksEMCardsMgtLocalStore = useLocalStore(() => ({
    paginationConfig: createPagingConfig(props.location.search)
  }));

  const onPagingChange = useCallback(
    action((current: number, pageSize: number) => {
      props.history.push(addPagingParams("hooksEMCardsMgt", current, pageSize));
      store.paginationConfig = { ...store.paginationConfig, current, pageSize };
    }),
    []
  );

  return useObserver(() => {
    return entityId != null ? (
      <HooksEMCardsEdit entityId={entityId} />
    ) : (
      <HooksEMCardsBrowse
        onPagingChange={onPagingChange}
        paginationConfig={store.paginationConfig}
      />
    );
  });
};
