import React, {FormEvent} from "react";
import {IReactionDisposer, observable, reaction, toJS} from "mobx";
import {observer} from 'mobx-react';
import {Alert, Button, Card, Form, message} from "antd";
import {FormComponentProps} from "antd/es/form";
import {GetFieldDecoratorOptions} from "antd/es/form/Form";
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import {
  injectMainStore,
  MainStoreInjected,
  DataInstanceStore,
  DataCollectionStore,
  WithId,
  isByteArray,
  isOneToManyAssociation,
  defaultCompare
} from "@cuba-platform/react-core";
import {MetaPropertyInfo, MetaClassInfo, SerializedEntityProps} from "@cuba-platform/rest";
import {Spinner} from "./Spinner";
import {Field} from "./form/Field";
import {MultilineText} from './MultilineText';
import {
  clearFieldErrors,
  constructFieldsWithErrors,
  extractServerValidationErrors,
  withLocalizedForm,
} from '../index';
import './EntityEditor.less';

export interface EntityEditorProps extends MainStoreInjected, WrappedComponentProps {
  /**
   * Name of the entity being edited
   */
  entityName: string;
  /**
   * A list of entity properties for which the form fields should be rendered.
   * Certain fields might not be editable if the user lacks edit permissions.
   */
  fields: string[];
  /**
   * A data instance representing the entity instance being edited
   */
  dataInstance: DataInstanceStore<Partial<WithId & SerializedEntityProps>>;
  /**
   * A map where keys are names of entity properties with relation type Association
   * and values are data collections containing entity instances that can be assigned
   * to the corresponding property (i.e. possible options that can be selected in a form field)
   */
  associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>>>;
  /**
   * A callback that is executed when the form is submitted.
   * Execution happens only after a successful client-side validation.
   * This prop can be used to override the default behavior which is to send
   * a request to REST API to update the entity.
   *
   * @param fieldValues - the values of antd {@link https://3x.ant.design/components/form/ Form} fields.
   * It can be obtained via antd Form's `getFieldsValue(fields)` method.
   * `fields` parameter of this method is a list of entity properties for which
   * the form field values should be collected.
   */
  onSubmit?: (fieldValues: {[field: string]: any}) => void;
  /**
   * A callback that is executed when Cancel button is clicked.
   * Examples of behavior initiated by this callback may include
   * navigating back to the entity browser screen or,
   * if the `EntityEditor` was opened in a modal, closing that modal.
   */
  onCancel: () => void;
  /**
   * Used in a context of Composition relationship. When `EntityEditor` is used to edit a nested entity,
   * parent entity name shall be supplied via this prop.
   */
  parentEntityName?: string;
  /**
   * This prop can be used to override the default caption on Submit button
   */
  submitButtonText?: string;
}

@injectMainStore
@observer
class EntityEditorComponent extends React.Component<EntityEditorProps & FormComponentProps> {

  @observable globalErrors: string[] = [];

  reactionDisposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    const {form, dataInstance, fields} = this.props;

    this.reactionDisposers.push(reaction(
      () => dataInstance.item,
      () => {
        form.setFieldsValue(
          dataInstance.getFieldValues(fields)
        );
      },
      {fireImmediately: true}
    ));
  }

  componentWillUnmount(): void {
    this.reactionDisposers.forEach(dispose => dispose());
  }

  get entityProperties(): MetaPropertyInfo[] {
    const {entityName, fields, mainStore} = this.props;
    return mainStore?.metadata
      ? getEntityProperties(entityName, fields, mainStore?.metadata)
          .sort((a, b) => defaultCompare(a.name, b.name))
      : [];
  }

  handleSubmit = (event: FormEvent) => {
    const {form, intl, fields, onSubmit} = this.props;

    event.preventDefault();
    event.stopPropagation();

    form.validateFields((clientError: any) => {
      if (clientError) {
        message.error(intl.formatMessage({id: "management.editor.validationError"}));
        return;
      }

      if (onSubmit) {
        onSubmit(form.getFieldsValue(fields));
      } else {
        this.defaultOnSubmit();
      }
    });
  };

  defaultOnSubmit = () => {
    const {form, fields, dataInstance, intl} = this.props;

    dataInstance
      .update(form.getFieldsValue(fields))
      .then(() => {
        message.success(intl.formatMessage({ id: "management.editor.success" }));
      })
      .catch((serverError: any) => {
        if (serverError.response && typeof serverError.response.json === "function") {
          serverError.response.json().then((response: any) => {
            clearFieldErrors(form);
            const {globalErrors, fieldErrors} = extractServerValidationErrors(response);
            this.globalErrors = globalErrors;
            if (fieldErrors.size > 0) {
              form.setFields(constructFieldsWithErrors(fieldErrors, form));
            }

            if (fieldErrors.size > 0 || globalErrors.length > 0) {
              message.error(intl.formatMessage({id: "management.editor.validationError"}));
            } else {
              message.error(intl.formatMessage({id: "management.editor.error"}));
            }
          });
        } else {
          message.error(
            intl.formatMessage({ id: "management.editor.error" })
          );
        }
      });
  };

  getOptionsContainer = (entityName: string): DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined => {
    const {associationOptions} = this.props;
    return associationOptions.get(entityName);
  };

  getFieldDecoratorOpts = (property: MetaPropertyInfo): GetFieldDecoratorOptions => {
    const opts: GetFieldDecoratorOptions = {};

    if (property.mandatory) {
      opts.rules = [{required: true}];
    }
    if (property.type === 'boolean') {
      opts.valuePropName = 'checked';
    }

    return opts;
  };

  render() {
    const {mainStore, dataInstance, onCancel, submitButtonText} = this.props;

    if (!mainStore?.isEntityDataLoaded()) { return <Spinner/> }

    const {status} = dataInstance;

    return (
      <Card className="narrow-layout">
        <Form onSubmit={this.handleSubmit} layout="vertical" className={'cuba-entity-editor'}>
          {this.renderFields()}
          {this.globalErrors.length > 0 && (
            <Alert
              message={<MultilineText lines={toJS(this.globalErrors)} />}
              type="error"
              className={'errormessage'}
            />
          )}
          <Form.Item className={'actions'}>
            <Button htmlType="button"
                    onClick={onCancel}
            >
              <FormattedMessage id="management.editor.cancel" />
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE" && status !== "ERROR"}
              loading={status === "LOADING"}
              className='submitbutton'
            >
              <FormattedMessage id={submitButtonText || 'management.editor.submit'} />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  renderFields() {
    const {entityName, form} = this.props;

    return this.entityProperties.map(property => {
      return (
        <Field
          entityName={entityName}
          propertyName={property.name}
          key={property.name}
          form={form}
          formItemOpts={{ style: { marginBottom: "12px" } }}
          getFieldDecoratorOpts={this.getFieldDecoratorOpts(property)}
          optionsContainer={this.getOptionsContainer(property.type)}
        />
      );
    });
  }

}

const EntityEditor = injectIntl<'intl', EntityEditorProps>(withLocalizedForm({
  onValuesChange: (theProps: any, changedValues: any) => {
    // Reset server-side errors when field is edited
    Object.keys(changedValues).forEach((fieldName: string) => {
      theProps.form.setFields({
        [fieldName]: {
          value: changedValues[fieldName]
        }
      });
    });
  }
})(EntityEditorComponent));

export function getEntityProperties(entityName: string, fields: string[], metadata: MetaClassInfo[]): MetaPropertyInfo[] {
  const allProperties = metadata.find((classInfo: MetaClassInfo) => classInfo.entityName === entityName)
    ?.properties || [];

  return allProperties.filter((property: MetaPropertyInfo) => {
    return (fields.indexOf(property.name) > -1) && isDisplayedProperty(property);
  });
}

function isDisplayedProperty(property: MetaPropertyInfo): boolean {
  return !isOneToManyAssociation(property)
    && !isByteArray(property);
}

export {EntityEditor};
