import * as React from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { observable } from "mobx";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  collection,
  injectMainStore,
  MainStoreInjected,
  EntityPermAccessControl
} from "@haulmont/jmix-react-core";
import { DataTable, Spinner } from "@haulmont/jmix-react-ui";

import { AssociationM2MTestEntity } from "../../cuba/entities/scr_AssociationM2MTestEntity";
import { SerializedEntity } from "@haulmont/jmix-rest";
import { AssociationM2MManagement } from "./AssociationM2MManagement";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class AssociationM2MBrowseComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<AssociationM2MTestEntity>(
    AssociationM2MTestEntity.NAME,
    {
      view: "associationM2MTestEntity-view"
    }
  );
  @observable selectedRowKey: string | undefined;

  fields = ["name"];

  showDeletionDialog = (e: SerializedEntity<AssociationM2MTestEntity>) => {
    Modal.confirm({
      title: this.props.intl.formatMessage(
        { id: "management.browser.delete.areYouSure" },
        { instanceName: e._instanceName }
      ),
      okText: this.props.intl.formatMessage({
        id: "management.browser.delete.ok"
      }),
      cancelText: this.props.intl.formatMessage({ id: "common.cancel" }),
      onOk: () => {
        this.selectedRowKey = undefined;
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    if (this.props.mainStore?.isEntityDataLoaded() !== true) return <Spinner />;

    const buttons = [
      <EntityPermAccessControl
        entityName={AssociationM2MTestEntity.NAME}
        operation="create"
        key="create"
      >
        <Link
          to={
            AssociationM2MManagement.PATH +
            "/" +
            AssociationM2MManagement.NEW_SUBPATH
          }
        >
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            type="primary"
            icon={<PlusOutlined />}
          >
            <span>
              <FormattedMessage id="common.create" />
            </span>
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={AssociationM2MTestEntity.NAME}
        operation="update"
        key="update"
      >
        <Link to={AssociationM2MManagement.PATH + "/" + this.selectedRowKey}>
          <Button
            htmlType="button"
            style={{ margin: "0 12px 12px 0" }}
            disabled={!this.selectedRowKey}
            type="default"
          >
            <FormattedMessage id="common.edit" />
          </Button>
        </Link>
      </EntityPermAccessControl>,
      <EntityPermAccessControl
        entityName={AssociationM2MTestEntity.NAME}
        operation="delete"
        key="delete"
      >
        <Button
          htmlType="button"
          style={{ margin: "0 12px 12px 0" }}
          disabled={!this.selectedRowKey}
          onClick={this.deleteSelectedRow}
          type="default"
        >
          <FormattedMessage id="common.remove" />
        </Button>
      </EntityPermAccessControl>
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

  getRecordById(id: string): SerializedEntity<AssociationM2MTestEntity> {
    const record:
      | SerializedEntity<AssociationM2MTestEntity>
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

const AssociationM2MBrowse = injectIntl(AssociationM2MBrowseComponent);

export default AssociationM2MBrowse;
