import {observer} from "mobx-react";
import {Select} from "antd";
import * as React from "react";
import { DataCollectionStore, WithId } from "@cuba-platform/react-core";
import {getStringId} from "@cuba-platform/rest";

export interface EntitySelectFieldProps {
  optionsContainer?: DataCollectionStore<WithId>,
  allowClear?: boolean,
}

export const EntitySelectField = observer((props: EntitySelectFieldProps) => {
  const {optionsContainer, ...rest} = props;
  return (
    <Select {...rest} loading={optionsContainer && optionsContainer.status === "LOADING"} >
      {optionsContainer && optionsContainer.items.filter(e => e.id != null).map(entity =>
        <Select.Option value={getStringId(entity.id!)} key={getStringId(entity.id!)}>
          {entity._instanceName}
        </Select.Option>)
      }
    </Select>);
});
