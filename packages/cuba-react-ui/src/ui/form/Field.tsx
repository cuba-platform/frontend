import * as React from "react";
import {observer} from "mobx-react";
import {FormField, FormFieldComponentProps} from "../FormField";
import {Form} from "antd";
import {FormComponentProps, FormItemProps} from 'antd/lib/form';
import {GetFieldDecoratorOptions} from 'antd/lib/form/Form';
import {Msg} from '../Msg';
import {FieldPermissionContainer} from './FieldPermssionContainer';
import {
  MainStoreInjected,
  DataCollectionStore,
  WithId,
  injectMainStore,
  getPropertyInfo
} from "@cuba-platform/react-core";
import {MetaClassInfo} from "@cuba-platform/rest";
import {uuidPattern} from "../../util/regex";

export interface FieldProps extends MainStoreInjected, FormComponentProps {
  entityName: string;
  propertyName: string;
  /**
   * This prop shall be supplied if the entity property has Association relation type.
   * It is a data collection containing entity instances that can be assigned to this property
   * (i.e. possible options that can be selected in a form field).
   */
  optionsContainer?: DataCollectionStore<WithId>;
  /**
   * This prop shall be supplied if the entity property has Composition relation type.
   * It is a view that will be used to limit the entity graph of a nested entity.
   */
  nestedEntityView?: string;
  /**
   * This prop shall be supplied if the entity property has Composition relation type.
   * It is an id of the enclosing entity instance.
   */
  parentEntityInstanceId?: string;

  /**
   * The value that will be assigned to {@link https://3x.ant.design/components/form/ | Form.Item} `key` property.
   * If not provided, {@link propertyName} will be used instead.
   */
  formItemKey?: string;
  /**
   * Props that will be passed through to {@link https://3x.ant.design/components/form/ | Form.Item} component.
   */
  formItemOpts?: FormItemProps;

  /**
   * Will be passed as `id` argument to {@link https://3x.ant.design/components/form/ | getFieldDecorator}.
   * If not provided, {@link propertyName} will be used instead.
   */
  fieldDecoratorId?: string;
  /**
   * Will be spread into the default options object
   * and passed as `options` argument to {@link https://3x.ant.design/components/form/ | getFieldDecorator}.
   */
  getFieldDecoratorOpts?: GetFieldDecoratorOptions;
  /**
   * Props that will be passed through to the underlying component (i.e. the actual component
   * that will be rendered, such as `DatePicker` or `Select`).
   */
  componentProps?: FormFieldComponentProps;
}

// noinspection JSUnusedGlobalSymbols
export const Field = injectMainStore(observer((props: FieldProps) => {

  const {getFieldDecorator} = props.form;

  const {
    entityName, propertyName, optionsContainer, fieldDecoratorId, getFieldDecoratorOpts, formItemKey, mainStore, componentProps,
    nestedEntityView, parentEntityInstanceId
  } = props;

  const formItemOpts: FormItemProps = {... props.formItemOpts};
  if (!formItemOpts.label) { formItemOpts.label = <Msg entityName={entityName} propertyName={propertyName}/> };

  return (
    <FieldPermissionContainer entityName={entityName} propertyName={propertyName} renderField={(isReadOnly: boolean) => {

      return <Form.Item key={formItemKey ? formItemKey : propertyName}
                        {...formItemOpts}>

        {getFieldDecorator(
            fieldDecoratorId ? fieldDecoratorId : propertyName,
          {...getDefaultOptions(mainStore?.metadata, entityName, propertyName), ...getFieldDecoratorOpts}
        )(
          <FormField entityName={entityName}
                     propertyName={propertyName}
                     disabled={isReadOnly}
                     optionsContainer={optionsContainer}
                     nestedEntityView={nestedEntityView}
                     parentEntityInstanceId={parentEntityInstanceId}
                     {...componentProps}
          />
        )}
      </Form.Item>

    }}/>);

}));

function getDefaultOptions(metadata: MetaClassInfo[] | undefined, entityName: string, propertyName: string): GetFieldDecoratorOptions {
  if (!metadata) {
    return {};
  }

  const propertyInfo = getPropertyInfo(metadata, entityName, propertyName);

  if (propertyInfo?.type === 'uuid') {
    return {
      rules: [
        { pattern: uuidPattern }
      ],
      validateTrigger: 'onSubmit'
    };
  }

  return {};
}
