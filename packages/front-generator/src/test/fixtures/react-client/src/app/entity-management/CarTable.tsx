import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { computed, observable } from "mobx";
import { Modal, Button } from "antd";
import {
  collection,
  injectMainStore,
  MainStoreInjected
} from "@cuba-platform/react-core";

import { DataTable, Spinner } from "@cuba-platform/react-ui";
import { Car } from "cuba/entities/mpg$Car";
import { SerializedEntity } from "@cuba-platform/rest";
import { CarManagement3 } from "./CarManagement3";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class CarTableComponent extends React.Component<
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

  @observable selectedRowKey: string | undefined;

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
        this.selectedRowKey = undefined;
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
    if (!this.dataLoaded) return <Spinner />;

    const buttons = [
      <Link
        to={CarManagement3.PATH + "/" + CarManagement3.NEW_SUBPATH}
        key="create"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          type="primary"
          icon="plus"
        >
          <span>
            <FormattedMessage id="management.browser.create" />
          </span>
        </Button>
      </Link>,
      <Link to={CarManagement3.PATH + "/" + this.selectedRowKey} key="edit">
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={!this.selectedRowKey}
          type="default"
        >
          <FormattedMessage id="management.browser.edit" />
        </Button>
      </Link>,
      <Button
        htmlType="button"
        style={{ margin: "0 12px 12px 0" }}
        disabled={!this.selectedRowKey}
        onClick={this.deleteSelectedRow}
        key="remove"
        type="default"
      >
        <FormattedMessage id="management.browser.remove" />
      </Button>
    ];

    return (
      <DataTable
        dataCollection={this.dataCollection}
        fields={this.fields}
        onRowSelectionChange={this.handleRowSelectionChange}
        hideSelectionColumn={true}
        buttons={buttons}
      />
    );
  }

  getRecordById(id: string): SerializedEntity<Car> {
    const record:
      | SerializedEntity<Car>
      | undefined = this.dataCollection.items.find(record => record.id === id);

    if (!record) {
      throw new Error("Cannot find entity with id " + id);
    }

    return record;
  }

  handleRowSelectionChange = (selectedRowKeys: string[]) => {
    this.selectedRowKey = selectedRowKeys[0];
  };

  deleteSelectedRow = () => {
    this.showDeletionDialog(this.getRecordById(this.selectedRowKey!));
  };
}

const CarTable = injectIntl(CarTableComponent);

export default CarTable;
