import * as React from "react";
import { Form, Alert, Button, Card, message } from "antd";
import { FormInstance } from "antd/es/form";
import { observer } from "mobx-react";
import { DatatypesManagement2 } from "./DatatypesManagement2";
import { Link, Redirect } from "react-router-dom";
import { IReactionDisposer, observable, reaction, toJS } from "mobx";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";
import {
  defaultHandleFinish,
  createAntdFormValidationMessages
} from "@haulmont/jmix-react-ui";

import {
  loadAssociationOptions,
  DataCollectionStore,
  instance,
  MainStoreInjected,
  injectMainStore
} from "@haulmont/jmix-react-core";

import { Field, MultilineText, Spinner } from "@haulmont/jmix-react-ui";

import "../../app/App.css";

import { DatatypesTestEntity } from "../../cuba/entities/scr_DatatypesTestEntity";
import { AssociationO2OTestEntity } from "../../cuba/entities/scr_AssociationO2OTestEntity";
import { AssociationM2OTestEntity } from "../../cuba/entities/scr_AssociationM2OTestEntity";
import { AssociationM2MTestEntity } from "../../cuba/entities/scr_AssociationM2MTestEntity";
import { IntIdentityIdTestEntity } from "../../cuba/entities/scr_IntIdentityIdTestEntity";
import { IntegerIdTestEntity } from "../../cuba/entities/scr_IntegerIdTestEntity";
import { StringIdTestEntity } from "../../cuba/entities/scr_StringIdTestEntity";

type Props = EditorProps & MainStoreInjected;

type EditorProps = {
  entityId: string;
};

@injectMainStore
@observer
class DatatypesEdit2Component extends React.Component<
  Props & WrappedComponentProps
> {
  dataInstance = instance<DatatypesTestEntity>(DatatypesTestEntity.NAME, {
    view: "datatypesTestEntity-view",
    loadImmediately: false
  });

  @observable associationO2OattrsDc:
    | DataCollectionStore<AssociationO2OTestEntity>
    | undefined;

  @observable associationM2OattrsDc:
    | DataCollectionStore<AssociationM2OTestEntity>
    | undefined;

  @observable associationM2MattrsDc:
    | DataCollectionStore<AssociationM2MTestEntity>
    | undefined;

  @observable intIdentityIdTestEntityAssociationO2OAttrsDc:
    | DataCollectionStore<IntIdentityIdTestEntity>
    | undefined;

  @observable integerIdTestEntityAssociationM2MAttrsDc:
    | DataCollectionStore<IntegerIdTestEntity>
    | undefined;

  @observable stringIdTestEntityAssociationO2OsDc:
    | DataCollectionStore<StringIdTestEntity>
    | undefined;

  @observable stringIdTestEntityAssociationM2OsDc:
    | DataCollectionStore<StringIdTestEntity>
    | undefined;

  @observable updated = false;
  @observable formRef: React.RefObject<FormInstance> = React.createRef();
  reactionDisposers: IReactionDisposer[] = [];

  fields = [
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
    "associationM2Mattr",
    "compositionO2Oattr",
    "compositionO2Mattr",
    "intIdentityIdTestEntityAssociationO2OAttr",
    "integerIdTestEntityAssociationM2MAttr",
    "stringIdTestEntityAssociationO2O",
    "stringIdTestEntityAssociationM2O"
  ];

  @observable globalErrors: string[] = [];

  /**
   * This method should be called after the user permissions has been loaded
   */
  loadAssociationOptions = () => {
    // MainStore should exist at this point
    if (this.props.mainStore != null) {
      const { getAttributePermission } = this.props.mainStore.security;

      this.associationO2OattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationO2Oattr",
        AssociationO2OTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.associationM2OattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationM2Oattr",
        AssociationM2OTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.associationM2MattrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "associationM2Mattr",
        AssociationM2MTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.intIdentityIdTestEntityAssociationO2OAttrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "intIdentityIdTestEntityAssociationO2OAttr",
        IntIdentityIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.integerIdTestEntityAssociationM2MAttrsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "integerIdTestEntityAssociationM2MAttr",
        IntegerIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.stringIdTestEntityAssociationO2OsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "stringIdTestEntityAssociationO2O",
        StringIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.stringIdTestEntityAssociationM2OsDc = loadAssociationOptions(
        DatatypesTestEntity.NAME,
        "stringIdTestEntityAssociationM2O",
        StringIdTestEntity.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );
    }
  };

  handleFinishFailed = () => {
    const { intl } = this.props;
    message.error(
      intl.formatMessage({ id: "management.editor.validationError" })
    );
  };

  handleFinish = (values: { [field: string]: any }) => {
    const { intl } = this.props;

    if (this.formRef.current != null) {
      defaultHandleFinish(
        values,
        this.dataInstance,
        intl,
        this.formRef.current,
        this.isNewEntity() ? "create" : "edit"
      ).then(({ success, globalErrors }) => {
        if (success) {
          this.updated = true;
        } else {
          this.globalErrors = globalErrors;
        }
      });
    }
  };

  isNewEntity = () => {
    return this.props.entityId === DatatypesManagement2.NEW_SUBPATH;
  };

  render() {
    if (this.updated) {
      return <Redirect to={DatatypesManagement2.PATH} />;
    }

    const { status, lastError, load } = this.dataInstance;
    const { mainStore, entityId, intl } = this.props;
    if (mainStore == null || !mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

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
          onFinish={this.handleFinish}
          onFinishFailed={this.handleFinishFailed}
          layout="vertical"
          ref={this.formRef}
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
            disabled={true}
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
            propertyName="readOnlyStringAttr"
            disabled={true}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationO2Oattr"
            optionsContainer={this.associationO2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Oattr"
            optionsContainer={this.associationM2OattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="associationM2Mattr"
            optionsContainer={this.associationM2MattrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="compositionO2Oattr"
            nestedEntityView="compositionO2OTestEntity-view"
            parentEntityInstanceId={
              this.props.entityId !== DatatypesManagement2.NEW_SUBPATH
                ? this.props.entityId
                : undefined
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
              this.props.entityId !== DatatypesManagement2.NEW_SUBPATH
                ? this.props.entityId
                : undefined
            }
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="intIdentityIdTestEntityAssociationO2OAttr"
            optionsContainer={this.intIdentityIdTestEntityAssociationO2OAttrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="integerIdTestEntityAssociationM2MAttr"
            optionsContainer={this.integerIdTestEntityAssociationM2MAttrsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationO2O"
            optionsContainer={this.stringIdTestEntityAssociationO2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          <Field
            entityName={DatatypesTestEntity.NAME}
            propertyName="stringIdTestEntityAssociationM2O"
            optionsContainer={this.stringIdTestEntityAssociationM2OsDc}
            formItemProps={{
              style: { marginBottom: "12px" }
            }}
          />

          {this.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(this.globalErrors)} />}
              type="error"
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Link to={DatatypesManagement2.PATH}>
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
  }

  componentDidMount() {
    if (this.isNewEntity()) {
      this.dataInstance.setItem(new DatatypesTestEntity());
    } else {
      this.dataInstance.load(this.props.entityId);
    }

    this.reactionDisposers.push(
      reaction(
        () => this.dataInstance.status,
        () => {
          const { intl } = this.props;
          if (
            this.dataInstance.lastError != null &&
            this.dataInstance.lastError !== "COMMIT_ERROR"
          ) {
            message.error(intl.formatMessage({ id: "common.requestFailed" }));
          }
        }
      )
    );

    this.reactionDisposers.push(
      reaction(
        () => this.props.mainStore?.security.isDataLoaded,
        (isDataLoaded, permsReaction) => {
          if (isDataLoaded === true) {
            // User permissions has been loaded.
            // We can now load association options.
            this.loadAssociationOptions(); // Calls REST API
            permsReaction.dispose();
          }
        },
        { fireImmediately: true }
      )
    );

    this.reactionDisposers.push(
      reaction(
        () => this.formRef.current,
        (formRefCurrent, formRefReaction) => {
          if (formRefCurrent != null) {
            // The Form has been successfully created.
            // It is now safe to set values on Form fields.
            this.reactionDisposers.push(
              reaction(
                () => this.dataInstance.item,
                () => {
                  formRefCurrent.setFieldsValue(
                    this.dataInstance.getFieldValues(this.fields)
                  );
                },
                { fireImmediately: true }
              )
            );
            formRefReaction.dispose();
          }
        },
        { fireImmediately: true }
      )
    );
  }

  componentWillUnmount() {
    this.reactionDisposers.forEach(dispose => dispose());
  }
}

export default injectIntl(DatatypesEdit2Component);
