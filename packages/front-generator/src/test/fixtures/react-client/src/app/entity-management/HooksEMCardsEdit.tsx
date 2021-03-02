import React, { useCallback, useEffect, RefObject } from "react";
import { Form, Alert, Button, Card, message } from "antd";
import { FormInstance } from "antd/es/form";
import useForm from "antd/lib/form/hooks/useForm";
import { useLocalStore, useObserver } from "mobx-react";
import { PATH, NEW_SUBPATH } from "./HooksEMCardsMgt";
import { Link, Redirect } from "react-router-dom";
import { toJS } from "mobx";
import { FormattedMessage, useIntl } from "react-intl";
import {
  defaultHandleFinish,
  createAntdFormValidationMessages
} from "@cuba-platform/react-ui";
import {
  loadAssociationOptions,
  DataCollectionStore,
  useInstance,
  MainStore,
  useMainStore,
  useReaction
} from "@cuba-platform/react-core";
import { Field, MultilineText, Spinner } from "@cuba-platform/react-ui";
import "app/App.css";
import { DatatypesTestEntity } from "cuba/entities/scr_DatatypesTestEntity";
import { AssociationO2OTestEntity } from "cuba/entities/scr_AssociationO2OTestEntity";
import { AssociationM2OTestEntity } from "cuba/entities/scr_AssociationM2OTestEntity";
import { AssociationM2MTestEntity } from "cuba/entities/scr_AssociationM2MTestEntity";
import { IntIdentityIdTestEntity } from "cuba/entities/scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "cuba/entities/scr_IntegerIdTestEntity";
import { StringIdTestEntity } from "cuba/entities/scr_StringIdTestEntity";

type Props = {
  entityId: string;
};

type HooksEMCardsEditAssociationOptions = {
  associationO2OattrsDc?: DataCollectionStore<AssociationO2OTestEntity>;
  associationM2OattrsDc?: DataCollectionStore<AssociationM2OTestEntity>;
  associationM2MattrsDc?: DataCollectionStore<AssociationM2MTestEntity>;
  intIdentityIdTestEntityAssociationO2OAttrsDc?: DataCollectionStore<
    IntIdentityIdTestEntity
  >;
  integerIdTestEntityAssociationM2MAttrsDc?: DataCollectionStore<
    IntegerIdTestEntity
  >;
  stringIdTestEntityAssociationO2OsDc?: DataCollectionStore<StringIdTestEntity>;
  stringIdTestEntityAssociationM2OsDc?: DataCollectionStore<StringIdTestEntity>;
};

type HooksEMCardsEditLocalStore = HooksEMCardsEditAssociationOptions & {
  updated: boolean;
  globalErrors: string[];
  formRef: RefObject<FormInstance>;
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
  "associationO2Oattr",
  "associationM2Oattr",
  "associationM2Mattr",
  "compositionO2Oattr",
  "compositionO2Mattr",
  "intIdentityIdTestEntityAssociationO2OAttr",
  "integerIdTestEntityAssociationM2MAttr",
  "stringIdTestEntityAssociationO2O",
  "stringIdTestEntityAssociationM2O",
  "readOnlyStringAttr"
];

const isNewEntity = (entityId: string) => {
  return entityId === NEW_SUBPATH;
};

const getAssociationOptions = (
  mainStore: MainStore
): HooksEMCardsEditAssociationOptions => {
  const { getAttributePermission } = mainStore.security;
  const associationOptions: HooksEMCardsEditAssociationOptions = {};

  associationOptions.associationO2OattrsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "associationO2Oattr",
    AssociationO2OTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.associationM2OattrsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "associationM2Oattr",
    AssociationM2OTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.associationM2MattrsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "associationM2Mattr",
    AssociationM2MTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.intIdentityIdTestEntityAssociationO2OAttrsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "intIdentityIdTestEntityAssociationO2OAttr",
    IntIdentityIdTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.integerIdTestEntityAssociationM2MAttrsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "integerIdTestEntityAssociationM2MAttr",
    IntegerIdTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.stringIdTestEntityAssociationO2OsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "stringIdTestEntityAssociationO2O",
    StringIdTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  associationOptions.stringIdTestEntityAssociationM2OsDc = loadAssociationOptions(
    DatatypesTestEntity.NAME,
    "stringIdTestEntityAssociationM2O",
    StringIdTestEntity.NAME,
    getAttributePermission,
    { view: "_minimal" }
  );

  return associationOptions;
};

const HooksEMCardsEdit = (props: Props) => {
  const { entityId } = props;

  const intl = useIntl();
  const mainStore = useMainStore();
  const [form] = useForm();

  const dataInstance = useInstance<DatatypesTestEntity>(
    DatatypesTestEntity.NAME,
    {
      view: "datatypesTestEntity-view",
      loadImmediately: false
    }
  );

  const store: HooksEMCardsEditLocalStore = useLocalStore(() => ({
    // Association options
    associationO2OattrsDc: undefined,
    associationM2OattrsDc: undefined,
    associationM2MattrsDc: undefined,
    intIdentityIdTestEntityAssociationO2OAttrsDc: undefined,
    integerIdTestEntityAssociationM2MAttrsDc: undefined,
    stringIdTestEntityAssociationO2OsDc: undefined,
    stringIdTestEntityAssociationM2OsDc: undefined,

    // Other
    updated: false,
    globalErrors: [],
    formRef: React.createRef()
  }));

  useEffect(() => {
    if (isNewEntity(entityId)) {
      dataInstance.current.setItem(new DatatypesTestEntity());
    } else {
      dataInstance.current.load(entityId);
    }
  }, [entityId, dataInstance]);

  // Create a reaction that displays request failed error message
  useReaction(
    () => dataInstance.current.status,
    () => {
      if (
        dataInstance.current.lastError != null &&
        dataInstance.current.lastError !== "COMMIT_ERROR"
      ) {
        message.error(intl.formatMessage({ id: "common.requestFailed" }));
      }
    }
  );

  // Create a reaction that waits for permissions data to be loaded,
  // loads Association options and disposes itself
  useReaction(
    () => mainStore.security.isDataLoaded,
    (isDataLoaded, permsReaction) => {
      if (isDataLoaded === true) {
        // User permissions has been loaded.
        // We can now load association options.
        const associationOptions = getAssociationOptions(mainStore); // Calls REST API
        Object.assign(store, associationOptions);
        permsReaction.dispose();
      }
    },
    { fireImmediately: true }
  );

  // Create a reaction that sets the fields values based on dataInstance.current.item
  useReaction(
    () => [store.formRef.current, dataInstance.current.item],
    ([formInstance]) => {
      if (formInstance != null) {
        form.setFieldsValue(dataInstance.current.getFieldValues(FIELDS));
      }
    },
    { fireImmediately: true }
  );

  const handleFinishFailed = useCallback(() => {
    message.error(
      intl.formatMessage({ id: "management.editor.validationError" })
    );
  }, [intl]);

  const handleFinish = useCallback(
    (values: { [field: string]: any }) => {
      if (form != null) {
        defaultHandleFinish(
          values,
          dataInstance.current,
          intl,
          form,
          isNewEntity(entityId) ? "create" : "edit"
        ).then(({ success, globalErrors }) => {
          if (success) {
            store.updated = true;
          } else {
            store.globalErrors = globalErrors;
          }
        });
      }
    },
    [entityId, intl, form, store.globalErrors, store.updated, dataInstance]
  );

  return useObserver(() => {
    if (store.updated) {
      return <Redirect to={PATH} />;
    }

    if (!mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

    const { status, lastError, load } = dataInstance.current;

    // do not stop on "COMMIT_ERROR" - it could be bean validation, so we should show fields with errors
    if (status === "ERROR" && lastError === "LOAD_ERROR") {
      return (
        <>
          <FormattedMessage id="common.requestFailed" />.
          <br />
          <br />
          <Button htmlType="button" onClick={() => load(entityId)}>
            <FormattedMessage id="common.retry" />
          </Button>
        </>
      );
    }

    return (
      <Card className="narrow-layout">
        <Form
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical"
          ref={store.formRef}
          form={form}
          validateMessages={createAntdFormValidationMessages(intl)}
        >
          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="bigDecimalAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="booleanAttr"
            formItemProps={{
              style: { marginBottom: "12px" },
              valuePropName: "checked"
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="dateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="dateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="doubleAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="integerAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="longAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="stringAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="timeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="uuidAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="localDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="offsetDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="localDateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="localTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="offsetTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="enumAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="name"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="associationO2Oattr"
            optionsContainer={store.associationO2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="associationM2Oattr"
            optionsContainer={store.associationM2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="associationM2Mattr"
            optionsContainer={store.associationM2MattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="compositionO2Oattr"
            nestedEntityView="compositionO2OTestEntity-view"
            parentEntityInstanceId={
              entityId !== NEW_SUBPATH ? entityId : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="compositionO2Mattr"
            nestedEntityView="compositionO2MTestEntity-view"
            parentEntityInstanceId={
              entityId !== NEW_SUBPATH ? entityId : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="intIdentityIdTestEntityAssociationO2OAttr"
            optionsContainer={
              store.intIdentityIdTestEntityAssociationO2OAttrsDc
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="integerIdTestEntityAssociationM2MAttr"
            optionsContainer={store.integerIdTestEntityAssociationM2MAttrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="stringIdTestEntityAssociationO2O"
            optionsContainer={store.stringIdTestEntityAssociationO2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="stringIdTestEntityAssociationM2O"
            optionsContainer={store.stringIdTestEntityAssociationM2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            stringPath="readOnlyStringAttr"
            disabled={true}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          {store.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(store.globalErrors)} />}
              type="error"
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Link to={PATH}>
              <Button htmlType="button">
                <FormattedMessage id="common.cancel" />
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE" && status !== "ERROR"}
              loading={status === "LOADING"}
              style={{ marginLeft: "8px" }}
            >
              <FormattedMessage id="common.submit" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  });
};

export default HooksEMCardsEdit;
