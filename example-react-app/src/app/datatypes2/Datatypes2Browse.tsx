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

import { DatatypesTestEntity2 } from "../../cuba/entities/scr_DatatypesTestEntity2";
import { SerializedEntity } from "@haulmont/jmix-rest";
import { Datatypes2Management } from "./Datatypes2Management";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class Datatypes2BrowseComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  dataCollection = collection<DatatypesTestEntity2>(DatatypesTestEntity2.NAME, {
    view: "datatypesTestEntity2-view"
  });
  @observable selectedRowKey: string | undefined;

  fields = [
    "datatypesTestEntityAttr",
    "intIdentityIdTestEntityAttr",
    "integerIdTestEntityAttr",
    "stringIdTestEntityAttr",
    "weirdStringIdTestEntityAttr"
  ];

  showDeletionDialog = (e: SerializedEntity<DatatypesTestEntity2>) => {
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
        entityName={DatatypesTestEntity2.NAME}
        operation="create"
        key="create"
      >
        <Link
          to={
            Datatypes2Management.PATH + "/" + Datatypes2Management.NEW_SUBPATH
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
        entityName={DatatypesTestEntity2.NAME}
        operation="update"
        key="update"
      >
        <Link to={Datatypes2Management.PATH + "/" + this.selectedRowKey}>
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
        entityName={DatatypesTestEntity2.NAME}
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

  getRecordById(id: string): SerializedEntity<DatatypesTestEntity2> {
    const record:
      | SerializedEntity<DatatypesTestEntity2>
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

const Datatypes2Browse = injectIntl(Datatypes2BrowseComponent);

export default Datatypes2Browse;
