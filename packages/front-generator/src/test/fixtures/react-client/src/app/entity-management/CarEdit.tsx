import * as React from "react";
import { FormEvent } from "react";
import { Alert, Button, Card, Form, message } from "antd";
import { observer } from "mobx-react";
import { CarManagement } from "./CarManagement";
import { FormComponentProps } from "antd/lib/form";
import { Link, Redirect } from "react-router-dom";
import { IReactionDisposer, observable, reaction, toJS } from "mobx";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

import {
  loadAssociationOptions,
  DataCollectionStore,
  instance,
  MainStoreInjected,
  injectMainStore
} from "@cuba-platform/react-core";

import {
  Field,
  withLocalizedForm,
  extractServerValidationErrors,
  constructFieldsWithErrors,
  clearFieldErrors,
  MultilineText,
  Spinner
} from "@cuba-platform/react-ui";

import "app/App.css";

import { Car } from "cuba/entities/mpg$Car";
import { Garage } from "cuba/entities/mpg$Garage";
import { TechnicalCertificate } from "cuba/entities/mpg$TechnicalCertificate";
import { FileDescriptor } from "cuba/entities/base/sys$FileDescriptor";

type Props = FormComponentProps & EditorProps & MainStoreInjected;

type EditorProps = {
  entityId: string;
};

@injectMainStore
@observer
class CarEditComponent extends React.Component<Props & WrappedComponentProps> {
  dataInstance = instance<Car>(Car.NAME, {
    view: "car-edit",
    loadImmediately: false
  });

  @observable garagesDc: DataCollectionStore<Garage> | undefined;

  @observable technicalCertificatesDc:
    | DataCollectionStore<TechnicalCertificate>
    | undefined;

  @observable photosDc: DataCollectionStore<FileDescriptor> | undefined;

  @observable updated = false;
  @observable formRef: React.RefObject<Form> = React.createRef();
  reactionDisposers: IReactionDisposer[] = [];

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

  @observable globalErrors: string[] = [];

  /**
   * This method should be called after the user permissions has been loaded
   */
  loadAssociationOptions = () => {
    // MainStore should exist at this point
    if (this.props.mainStore != null) {
      const { getAttributePermission } = this.props.mainStore.security;

      this.garagesDc = loadAssociationOptions(
        Car.NAME,
        "garage",
        Garage.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.technicalCertificatesDc = loadAssociationOptions(
        Car.NAME,
        "technicalCertificate",
        TechnicalCertificate.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );

      this.photosDc = loadAssociationOptions(
        Car.NAME,
        "photo",
        FileDescriptor.NAME,
        getAttributePermission,
        { view: "_minimal" }
      );
    }
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error(
          this.props.intl.formatMessage({
            id: "management.editor.validationError"
          })
        );
        return;
      }
      this.dataInstance
        .update(this.props.form.getFieldsValue(this.fields))
        .then(() => {
          message.success(
            this.props.intl.formatMessage({ id: "management.editor.success" })
          );
          this.updated = true;
        })
        .catch((e: any) => {
          if (e.response && typeof e.response.json === "function") {
            e.response.json().then((response: any) => {
              clearFieldErrors(this.props.form);
              const {
                globalErrors,
                fieldErrors
              } = extractServerValidationErrors(response);
              this.globalErrors = globalErrors;
              if (fieldErrors.size > 0) {
                this.props.form.setFields(
                  constructFieldsWithErrors(fieldErrors, this.props.form)
                );
              }

              if (fieldErrors.size > 0 || globalErrors.length > 0) {
                message.error(
                  this.props.intl.formatMessage({
                    id: "management.editor.validationError"
                  })
                );
              } else {
                message.error(
                  this.props.intl.formatMessage({
                    id: "management.editor.error"
                  })
                );
              }
            });
          } else {
            message.error(
              this.props.intl.formatMessage({ id: "management.editor.error" })
            );
          }
        });
    });
  };

  render() {
    if (this.updated) {
      return <Redirect to={CarManagement.PATH} />;
    }

    const { status } = this.dataInstance;
    const { mainStore } = this.props;
    if (mainStore == null || !mainStore.isEntityDataLoaded()) {
      return <Spinner />;
    }

    return (
      <Card className="narrow-layout">
        <Form onSubmit={this.handleSubmit} layout="vertical" ref={this.formRef}>
          <Field
            entityName={Car.NAME}
            propertyName="manufacturer"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{
              rules: [{ required: true }]
            }}
          />

          <Field
            entityName={Car.NAME}
            propertyName="model"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="regNumber"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="purchaseDate"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="manufactureDate"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="wheelOnRight"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{
              valuePropName: "checked"
            }}
          />

          <Field
            entityName={Car.NAME}
            propertyName="carType"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{
              rules: [{ required: true }]
            }}
          />

          <Field
            entityName={Car.NAME}
            propertyName="ecoRank"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="maxPassengers"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="price"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="mileage"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="garage"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.garagesDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="technicalCertificate"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.technicalCertificatesDc}
            getFieldDecoratorOpts={{}}
          />

          <Field
            entityName={Car.NAME}
            propertyName="photo"
            form={this.props.form}
            formItemOpts={{ style: { marginBottom: "12px" } }}
            optionsContainer={this.photosDc}
            getFieldDecoratorOpts={{}}
          />

          {this.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(this.globalErrors)} />}
              type="error"
              style={{ marginBottom: "24px" }}
            />
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Link to={CarManagement.PATH}>
              <Button htmlType="button">
                <FormattedMessage id="management.editor.cancel" />
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE" && status !== "ERROR"}
              loading={status === "LOADING"}
              style={{ marginLeft: "8px" }}
            >
              <FormattedMessage id="management.editor.submit" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  componentDidMount() {
    if (this.props.entityId !== CarManagement.NEW_SUBPATH) {
      this.dataInstance.load(this.props.entityId);
    } else {
      this.dataInstance.setItem(new Car());
    }

    this.reactionDisposers.push(
      reaction(
        () => this.props.mainStore?.security.effectivePermissions,
        (perms, permsReaction) => {
          if (perms != null) {
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
                  this.props.form.setFieldsValue(
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

export default injectIntl(
  withLocalizedForm<EditorProps>({
    onValuesChange: (props: any, changedValues: any) => {
      // Reset server-side errors when field is edited
      Object.keys(changedValues).forEach((fieldName: string) => {
        props.form.setFields({
          [fieldName]: {
            value: changedValues[fieldName]
          }
        });
      });
    }
  })(CarEditComponent)
);
