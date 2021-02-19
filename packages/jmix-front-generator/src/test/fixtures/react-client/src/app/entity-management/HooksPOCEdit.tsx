import React, { useCallback, useEffect, RefObject } from "react";
import { Form, Alert, Button, Card, message } from "antd";
import { FormInstance } from "antd/es/form";
import useForm from "antd/lib/form/hooks/useForm";
import { useLocalStore, useObserver } from "mobx-react";
import { HooksPOCManagement } from "./HooksPOCManagement";
import { Link, Redirect } from "react-router-dom";
import { toJS } from "mobx";
import { FormattedMessage, useIntl } from "react-intl";
import {
  defaultHandleFinish,
  createAntdFormValidationMessages
} from "@haulmont/jmix-react-ui";
import {
  loadAssociationOptions,
  DataCollectionStore,
  useInstance,
  MainStore,
  useMainStore,
  useReaction
} from "@haulmont/jmix-react-core";
import { Field, MultilineText, Spinner } from "@haulmont/jmix-react-ui";
import "app/App.css";
import { DatatypesTestEntity } from "jmix/entities/scr_DatatypesTestEntity";
import { AssociationO2OTestEntity } from "jmix/entities/scr_AssociationO2OTestEntity";
import { AssociationM2OTestEntity } from "jmix/entities/scr_AssociationM2OTestEntity";
import { AssociationM2MTestEntity } from "jmix/entities/scr_AssociationM2MTestEntity";
import { IntIdentityIdTestEntity } from "jmix/entities/scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "jmix/entities/scr_IntegerIdTestEntity";
import { StringIdTestEntity } from "jmix/entities/scr_StringIdTestEntity";

type Props = {
  entityId: string;
};

type HooksPOCEditAssociationOptions = {
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

type HooksPOCEditLocalStore = HooksPOCEditAssociationOptions & {
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
  return entityId === HooksPOCManagement.NEW_SUBPATH;
};

const getAssociationOptions = (
  mainStore: MainStore
): HooksPOCEditAssociationOptions => {
  const { getAttributePermission } = mainStore.security;
  const associationOptions: HooksPOCEditAssociationOptions = {};

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

const HooksPOCEdit = (props: Props) => {
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

  const store: HooksPOCEditLocalStore = useLocalStore(() => ({
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
      return <Redirect to={HooksPOCManagement.PATH} />;
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
            propertyName="bigDecimalAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="booleanAttr"
            formItemProps={{
              style: { marginBottom: "12px" },
              valuePropName: "checked"
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="dateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="dateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="doubleAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="integerAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="longAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="timeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="uuidAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="offsetDateTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localDateAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="localTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="offsetTimeAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="enumAttr"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="name"
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationO2Oattr"
            optionsContainer={store.associationO2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Oattr"
            optionsContainer={store.associationM2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Mattr"
            optionsContainer={store.associationM2MattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="compositionO2Oattr"
            nestedEntityView="compositionO2OTestEntity-view"
            parentEntityInstanceId={
              entityId !== HooksPOCManagement.NEW_SUBPATH ? entityId : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="compositionO2Mattr"
            nestedEntityView="compositionO2MTestEntity-view"
            parentEntityInstanceId={
              entityId !== HooksPOCManagement.NEW_SUBPATH ? entityId : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="intIdentityIdTestEntityAssociationO2OAttr"
            optionsContainer={
              store.intIdentityIdTestEntityAssociationO2OAttrsDc
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="integerIdTestEntityAssociationM2MAttr"
            optionsContainer={store.integerIdTestEntityAssociationM2MAttrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationO2O"
            optionsContainer={store.stringIdTestEntityAssociationO2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationM2O"
            optionsContainer={store.stringIdTestEntityAssociationM2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="readOnlyStringAttr"
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
            <Link to={HooksPOCManagement.PATH}>
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

export default HooksPOCEdit;
