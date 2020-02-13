import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { computed } from "mobx";
import { Modal, Button, Card, Icon } from "antd";
import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import { EntityProperty, Spinner } from "@cuba-platform/react-ui";
import { Car } from "cuba/entities/mpg$Car";
import { SerializedEntity } from "@cuba-platform/rest";
import { CarManagement } from "./CarManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class CarCardsComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<Car>(Car.NAME, {
    view: "car-edit",
    sort: "-updateTs"
  });
  fields = [
    "manufacturer",
    "model",
    "regNumber",
    "purchaseDate",
    "manufactureDate",
    "wheelOnRight",
    "carType",
    "ecoRank",
    "maxPassengers",
    "price",
    "mileage",
    "garage",
    "technicalCertificate",
    "photo"
  ];

  showDeletionDialog = (e: SerializedEntity<Car>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({
        id: "management.browser.delete.cancel"
      }),
      onOk: () => {
        return this.dataCollection.delete(e);
      }
    });
  };

  @computed private get dataLoaded() {
    const { mainStore } = this.props;
    return (
      mainStore &&
      !!mainStore.messages &&
      !!mainStore.metadata &&
      !!mainStore.enums &&
      mainStore.security.dataLoaded
    );
  }

  render() {
    const { status, items } = this.dataCollection;
    if (status === "LOADING" || !this.dataLoaded) {
      return <Spinner />;
    }

    return (
      <div className="narrow-layout">
        <div style={{ marginBottom: "12px" }}>
          <Link to={CarManagement.PATH + "/" + CarManagement.NEW_SUBPATH}>
            <Button htmlType="button" type="primary" icon="plus">
              <span>
                <FormattedMessage id="management.browser.create" />
              </span>
            </Button>
          </Link>
        </div>

        {items == null || items.length === 0 ? (
          <p>
            <FormattedMessage id="management.browser.noItems" />
          </p>
        ) : null}
        {items.map(e => (
          <Card
            title={e._instanceName}
            key={e.id}
            style={{ marginBottom: "12px" }}
            actions={[
              <Icon
                type="delete"
                key="delete"
                onClick={() => this.showDeletionDialog(e)}
              />,
              <Link to={CarManagement.PATH + "/" + e.id} key="edit">
                <Icon type="edit" />
              </Link>
            ]}
          >
            {this.fields.map(p => (
              <EntityProperty
                entityName={Car.NAME}
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

const CarCards = injectIntl(CarCardsComponent);

export default CarCards;
