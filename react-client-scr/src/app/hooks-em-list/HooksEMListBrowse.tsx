import React, { useEffect, useCallback } from "react";
import { useObserver } from "mobx-react";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Button, List, message } from "antd";
import {
  useCollection,
  useMainStore,
  useReaction,
  EntityPermAccessControl
} from "@cuba-platform/react-core";
import {
  EntityProperty,
  Paging,
  setPagination,
  Spinner
} from "@cuba-platform/react-ui";
import { DatatypesTestEntity } from "../../cuba/entities/scr_DatatypesTestEntity";
import { SerializedEntity, getStringId } from "@cuba-platform/rest";
import { PATH, NEW_SUBPATH } from "./HooksEMListMgt";
import { FormattedMessage, useIntl } from "react-intl";
import { PaginationConfig } from "antd/es/pagination";

type Props = {
  paginationConfig: PaginationConfig;
  onPagingChange: (current: number, pageSize: number) => void;
};

const FIELDS = [
  "bigDecimalAttr",
  "booleanAttr",
  "dateAttr",
  "dateTimeAttr",
  "doubleAttr",
  "integerAttr",
  "longAttr",
  "stringAttr",
  "timeAttr",
  "uuidAttr",
  "localDateTimeAttr",
  "offsetDateTimeAttr",
  "localDateAttr",
  "localTimeAttr",
  "offsetTimeAttr",
  "enumAttr",
  "name",
  "readOnlyStringAttr",
  "associationO2Oattr",
  "associationM2Oattr",
  "compositionO2Oattr",
  "intIdentityIdTestEntityAssociationO2OAttr",
  "stringIdTestEntityAssociationO2O",
  "stringIdTestEntityAssociationM2O"
];

const HooksEMListBrowse = (props: Props) => {
  const { paginationConfig, onPagingChange } = props;

  const intl = useIntl();
  const mainStore = useMainStore();

  const dataCollection = useCollection<DatatypesTestEntity>(
    DatatypesTestEntity.NAME,
    {
      view: "datatypesTestEntity-view",
      sort: "-updateTs",
      loadImmediately: false
    }
  );

  useEffect(() => {
    setPagination(paginationConfig, dataCollection.current, true);
  }, [paginationConfig, dataCollection]);

  useReaction(
    () => dataCollection.current.status,
    status => {
      if (status === "ERROR") {
        message.error(intl.formatMessage({ id: "common.requestFailed" }));
      }
    }
  );

  const showDeletionDialog = useCallback(
    (e: SerializedEntity<DatatypesTestEntity>) => {
      Modal.confirm({
        title: intl.formatMessage(
          { id: "management.browser.delete.areYouSure" },
          { instanceName: e._instanceName }
        ),
        okText: intl.formatMessage({
          id: "management.browser.delete.ok"
        }),
        cancelText: intl.formatMessage({ id: "common.cancel" }),
        onOk: () => {
          return dataCollection.current.delete(e);
        }
      });
    },
    [intl, dataCollection]
  );

  return useObserver(() => {
    const { status, items, count } = dataCollection.current;

    if (status === "LOADING" || mainStore?.isEntityDataLoaded() !== true) {
      return <Spinner />;
    }

    return (
      <div className="narrow-layout">
        <EntityPermAccessControl
          entityName={DatatypesTestEntity.NAME}
          operation="create"
        >
          <div style={{ marginBottom: "12px" }}>
            <Link to={PATH + "/" + NEW_SUBPATH}>
              <Button htmlType="button" type="primary" icon={<PlusOutlined />}>
                <span>
                  <FormattedMessage id="common.create" />
                </span>
              </Button>
            </Link>
          </div>
        </EntityPermAccessControl>

        <List
          itemLayout="horizontal"
          bordered
          dataSource={items}
          renderItem={item => (
            <List.Item
              actions={[
                <DeleteOutlined
                  key="delete"
                  onClick={() => showDeletionDialog(item)}
                />,
                <Link to={PATH + "/" + getStringId(item.id!)} key="edit">
                  <EditOutlined />
                </Link>
              ]}
            >
              <div style={{ flexGrow: 1 }}>
                {FIELDS.map(p => (
                  <EntityProperty
                    entityName={DatatypesTestEntity.NAME}
                    propertyName={p}
                    value={item[p]}
                    key={p}
                  />
                ))}
              </div>
            </List.Item>
          )}
        />

        {!paginationConfig.disabled && (
          <div style={{ margin: "12px 0 12px 0", float: "right" }}>
            <Paging
              paginationConfig={paginationConfig}
              onPagingChange={onPagingChange}
              total={count}
            />
          </div>
        )}
      </div>
    );
  });
};

export default HooksEMListBrowse;
