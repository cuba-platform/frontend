import * as React from "react";
import {observer} from "mobx-react";
import {FormField} from "../FormField";
import {injectMainStore, MainStoreInjected} from "../../app/MainStore";
import {WithId} from "../../util/metadata";
import {DataCollectionStore} from "../../data/Collection";
import {Form} from "antd";
import {FormComponentProps, FormItemProps} from 'antd/lib/form';
import {GetFieldDecoratorOptions} from 'antd/lib/form/Form';
import {Msg} from '../Msg';
import {FieldPermissionContainer} from './FieldPermssionContainer';

type Props = MainStoreInjected & FormComponentProps & {
  entityName: string
  propertyName: string
  optionsContainer?: DataCollectionStore<WithId>

  // form item
  formItemKey?: string
  formItemOpts?: FormItemProps

  // field decorator
  fieldDecoratorId?: string
  getFieldDecoratorOpts?: GetFieldDecoratorOptions
}

// noinspection JSUnusedGlobalSymbols
export const Field = injectMainStore(observer((props: Props) => {

  const {getFieldDecorator} = props.form;

  const {entityName, propertyName, optionsContainer, fieldDecoratorId, getFieldDecoratorOpts, formItemKey} = props;

  const formItemOpts: FormItemProps = {... props.formItemOpts};
  if (!formItemOpts.label) formItemOpts.label = <Msg entityName={entityName} propertyName={propertyName}/>;

  return (
    <FieldPermissionContainer entityName={entityName} propertyName={propertyName} renderField={(isReadOnly) => {

      return <Form.Item key={formItemKey ? formItemKey : propertyName}
                        {...formItemOpts}>

        {getFieldDecorator(fieldDecoratorId ? fieldDecoratorId : propertyName, getFieldDecoratorOpts)(
          <FormField entityName={entityName}
                     propertyName={propertyName}
                     disabled={isReadOnly}
                     optionsContainer={optionsContainer}
          />
        )}
      </Form.Item>

    }}/>);

}));

