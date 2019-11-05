import * as React from "react";
import { observer } from "mobx-react";
import { FavoriteCar } from "cuba/entities/mpg$FavoriteCar";
import { Card, Icon } from "antd";
import { collection, EntityProperty } from "@cuba-platform/react";

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
      <div className="page-layout-narrow">
        {items.map(e => (
          <Card
            title={e._instanceName}
            key={e.id}
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
