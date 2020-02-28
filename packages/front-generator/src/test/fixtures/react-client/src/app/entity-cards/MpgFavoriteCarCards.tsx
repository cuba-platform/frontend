import * as React from "react";
import { observer } from "mobx-react";
import { FavoriteCar } from "cuba/entities/mpg$FavoriteCar";
import { Card, Icon } from "antd";
import { collection } from "@cuba-platform/react-core";
import { EntityProperty } from "@cuba-platform/react-ui";

@observer
export class MpgFavoriteCarCards extends React.Component {
  dataCollection = collection<FavoriteCar>(FavoriteCar.NAME, {
    view: "favoriteCar-view",
    sort: "-updateTs"
  });
  fields = ["notes", "car", "user"];

  render() {
    const { status, items } = this.dataCollection;

    if (status === "LOADING") {
      return <Icon type="spin" />;
    }

    return (
      <div className="narrow-layout">
        {items.map(e => (
          <Card
            title={e._instanceName}
            key={e.id ? e.id : undefined}
            style={{ marginBottom: "12px" }}
          >
            {this.fields.map(p => (
              <EntityProperty
                entityName={FavoriteCar.NAME}
                propertyName={p}
                value={e[p]}
                key={p}
              />
            ))}
          </Card>
        ))}
      </div>
    );
  }
}
