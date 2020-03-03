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

type Props = MainStoreInjected & FormComponentProps & {
  entityName: string;
  propertyName: string;
  optionsContainer?: DataCollectionStore<WithId>;
  nestedEntityName?: string;
  nestedEntityType?: new () => WithId;
  nestedEntityView?: string;

  // form item
  formItemKey?: string;
  formItemOpts?: FormItemProps;

  // field decorator
  fieldDecoratorId?: string;
  getFieldDecoratorOpts?: GetFieldDecoratorOptions;
  componentProps?: FormFieldComponentProps;
}

// noinspection JSUnusedGlobalSymbols
export const Field = injectMainStore(observer((props: Props) => {

  const {getFieldDecorator} = props.form;

  const {
    entityName, propertyName, optionsContainer, fieldDecoratorId, getFieldDecoratorOpts, formItemKey, mainStore, componentProps,
    nestedEntityName, nestedEntityType, nestedEntityView
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
                     nestedEntityName={nestedEntityName}
                     nestedEntityType={nestedEntityType}
                     nestedEntityView={nestedEntityView}
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
