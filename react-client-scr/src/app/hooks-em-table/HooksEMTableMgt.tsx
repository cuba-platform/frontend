import React from "react";
import { RouteComponentProps } from "react-router";
import { useObserver } from "mobx-react";
import HooksEMTableEdit from "./HooksEMTableEdit";
import HooksEMTableBrowse from "./HooksEMTableBrowse";

type Props = RouteComponentProps<{ entityId?: string }>;

export const PATH = "/hooksEMTableMgt";
export const NEW_SUBPATH = "new";

export const HooksEMTableMgt = (props: Props) => {
  const { entityId } = props.match.params;

  return useObserver(() => {
    return entityId != null ? (
      <HooksEMTableEdit entityId={entityId} />
    ) : (
      <HooksEMTableBrowse />
    );
  });
};
