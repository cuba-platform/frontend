import {observer} from "mobx-react";
import {Select} from "antd";
import * as React from "react";
import {DataCollectionStore} from "../data/Collection";
import {WithId} from "../util/metadata";

export interface EntitySelectFieldProps {
  optionsContainer?: DataCollectionStore<WithId>,
  allowClear?: boolean,
}

export const EntitySelectField = observer((props: EntitySelectFieldProps) => {
  const {optionsContainer, ...rest} = props;
  return (
    <Select {...rest} loading={optionsContainer && optionsContainer.status === "LOADING"} >
      {optionsContainer && optionsContainer.items.map(entity =>
        <Select.Option value={entity.id} key={entity.id}>
          {entity._instanceName}
        </Select.Option>)
      }
    </Select>);
});
