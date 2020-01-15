import * as React from "react";
import { observer } from "mobx-react";
import { Modal, Button, List, Icon } from "antd";
import { Car } from "cuba/entities/mpg$Car";
import { Link } from "react-router-dom";
import { Spinner } from "../common/Spinner";
import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";
import { EntityProperty } from "@cuba-platform/react-ui";
import { SerializedEntity } from "@cuba-platform/rest";
import { CarManagement2 } from "./CarManagement2";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class CarListComponent extends React.Component<
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

  render() {
    const { status, items } = this.dataCollection;
    const { mainStore } = this.props;
    if (status === "LOADING" || !mainStore || !mainStore.ready) {
      return <Spinner />;
    }

    return (
      <div className="narrow-layout">
        <div style={{ marginBottom: "12px" }}>
          <Link to={CarManagement2.PATH + "/" + CarManagement2.NEW_SUBPATH}>
            <Button htmlType="button" type="primary" icon="plus">
              <span>
                <FormattedMessage id="management.browser.create" />
              </span>
            </Button>
          </Link>
        </div>

        <List
          itemLayout="horizontal"
          bordered
          dataSource={items}
          renderItem={item => (
            <List.Item
              actions={[
                <Icon
                  type="delete"
                  key="delete"
                  onClick={() => this.showDeletionDialog(item)}
                />,
                <Link to={CarManagement2.PATH + "/" + item.id} key="edit">
                  <Icon type="edit" />
                </Link>
              ]}
            >
              <div style={{ flexGrow: 1 }}>
                {this.fields.map(p => (
                  <EntityProperty
                    entityName={Car.NAME}
                    propertyName={p}
                    value={item[p]}
                    key={p}
                  />
                ))}
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const CarList = injectIntl(CarListComponent);

export default CarList;
