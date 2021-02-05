import {
  clientSideCollection,
  ClientSideDataCollectionStore,
  DataCollectionStore,
  DataInstanceStore,
  defaultCompare,
  formFieldsToInstanceItem,
  generateTemporaryEntityId,
  getCubaREST,
  getPropertyInfo,
  injectMainStore,
  instance,
  instanceItemToFormFields, isByteArray,
  isFileProperty, isOneToManyAssociation,
  MainStoreInjected,
  WithId,
  loadAllAssociationOptions
} from '@haulmont/jmix-react-core';
import { FormItemProps, FormInstance } from 'antd/es/form';
import {observer} from 'mobx-react';
import {Msg} from '../Msg';
import {FieldPermissionContainer} from './FieldPermssionContainer';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Drawer,
  Input,
  message,
  Modal,
  Select,
  Spin,
  TimePicker,
  Form,
} from 'antd';
import {
  Cardinality,
  EnumInfo,
  EnumValueInfo,
  MetaClassInfo,
  MetaPropertyInfo,
  PropertyType,
  SerializedEntityProps, View, ViewProperty,
} from '@haulmont/jmix-rest';
import {uuidPattern} from '../../util/regex';
import * as React from 'react';
import {SelectProps, SelectValue} from 'antd/es/select';
import {InputProps} from 'antd/es/input/Input';
import {InputNumberProps} from 'antd/es/input-number';
import {CheckboxProps} from 'antd/es/checkbox/Checkbox';
import {DatePickerProps} from 'antd/es/date-picker';
import {TimePickerProps} from 'antd/es/time-picker';
import {FileUpload, FileUploadProps} from '../FileUpload';
import {EntitySelectField} from '../EntitySelectField';
import {IntegerInput} from './IntegerInput';
import {DoubleInput} from './DoubleInput';
import {LongInput} from './LongInput';
import {BigDecimalInput} from './BigDecimalInput';
import {UuidInput} from './UuidInput';
import {FormattedMessage, injectIntl, WrappedComponentProps, IntlShape} from 'react-intl';
import {computed, IObservableArray, IReactionDisposer, observable, reaction, toJS} from 'mobx';
import {RefObject} from 'react';
import './EntityEditor.less';
import './NestedEntitiesTableField.less';
import './NestedEntityField.less';
import {DataTable} from '../table/DataTable';
// noinspection ES6PreferShortImport Importing from ../../index.ts will cause a circular dependency
import {
  clearFieldErrors,
  constructFieldsWithErrors,
  extractServerValidationErrors
} from '../../util/errorHandling';
import {MultilineText} from '../MultilineText';
import {Spinner} from '../Spinner';
// noinspection ES6PreferShortImport Importing from ../../index.ts will cause a circular dependency
import {createAntdFormValidationMessages} from '../../i18n/validation';
import {CommitMode} from '@haulmont/jmix-rest';


export interface FieldProps extends MainStoreInjected {
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
   * When `true`, the field will be non-editable.
   */
  disabled?: boolean;
  /**
   * Props that will be passed through to {@link https://ant.design/components/form/ | Form.Item} component.
   */
  formItemProps?: FormItemProps;
  /**
   * Props that will be passed through to the underlying component (i.e. the actual component
   * that will be rendered, such as `DatePicker` or `Select`).
   */
  componentProps?: FormFieldComponentProps;
}

// noinspection JSUnusedGlobalSymbols
export const Field = injectMainStore(observer((props: FieldProps) => {

  const {
    entityName, propertyName, optionsContainer, mainStore, componentProps,
    nestedEntityView, parentEntityInstanceId, disabled, formItemProps
  } = props;

  return (
    <FieldPermissionContainer entityName={entityName} propertyName={propertyName} renderField={(isReadOnly: boolean) => {

      return <Form.Item {...{...getDefaultFormItemProps(mainStore?.metadata, entityName, propertyName), ...formItemProps}}>
        <FormField entityName={entityName}
                   propertyName={propertyName}
                   disabled={isReadOnly || disabled}
                   optionsContainer={optionsContainer}
                   nestedEntityView={nestedEntityView}
                   parentEntityInstanceId={parentEntityInstanceId}
                   {...componentProps}
        />
      </Form.Item>

    }}/>);

}));

function getDefaultFormItemProps(metadata: MetaClassInfo[] | undefined, entityName: string, propertyName: string): FormItemProps {
  const formItemProps: FormItemProps = {
    name: propertyName,
    label: <Msg entityName={entityName} propertyName={propertyName}/>
  };

  if (!metadata) {
    return formItemProps;
  }

  const propertyInfo = getPropertyInfo(metadata, entityName, propertyName);

  if (propertyInfo?.type === 'uuid') {
    formItemProps.rules = [
        { pattern: uuidPattern }
      ];
    formItemProps.validateTrigger = 'onSubmit';
  }

  return formItemProps;
}

export type FormFieldComponentProps = SelectProps<SelectValue> | InputProps | InputNumberProps | CheckboxProps | DatePickerProps | TimePickerProps | FileUploadProps
  | NestedEntityFieldProps | NestedEntitiesTableFieldProps;

// TODO We should probably make it an interface as it is not convenient to document type declarations with TSDoc.
// TODO However, that would be a minor breaking change, as interface cannot extend FormFieldComponentProps.
/**
 * See {@link FieldProps}
 */
export type FormFieldProps = MainStoreInjected & {
  entityName: string;
  propertyName: string;
  disabled?: boolean;
  optionsContainer?: DataCollectionStore<WithId>;
  nestedEntityView?: string;
  parentEntityInstanceId?: string;
} & FormFieldComponentProps;

// forwardRef is required to avoid a console warning
// as Form.Item will attempt to pass a ref
export const FormField = injectMainStore(observer(React.forwardRef((props: FormFieldProps, _ref: any) => {

  const {
    entityName, propertyName, optionsContainer, mainStore, nestedEntityView, parentEntityInstanceId,
    ...rest
  } = props;

  if (mainStore == null || mainStore.metadata == null) {
    return <Input {...(rest as InputProps)}/>;
  }
  const propertyInfo = getPropertyInfo(mainStore!.metadata, entityName, propertyName);
  if (propertyInfo == null) {
    return <Input {...(rest as InputProps)}/>
  }

  if (isFileProperty(propertyInfo)) {
    return <FileUpload {...(rest as FileUploadProps)}/>;
  }

  switch (propertyInfo.attributeType) {
    case 'ENUM':
      return <EnumField enumClass={propertyInfo.type} allowClear={getAllowClear(propertyInfo)} {...rest as SelectProps<SelectValue> & MainStoreInjected}/>;
    case 'ASSOCIATION':
      const mode = getSelectMode(propertyInfo.cardinality);
      return <EntitySelectField {...{mode, optionsContainer}} allowClear={getAllowClear(propertyInfo)} {...rest}/>;
    case 'COMPOSITION':
      if (nestedEntityView) {
        const nestedEntityName = mainStore.metadata.find((metaClass: MetaClassInfo) => metaClass.entityName === entityName)?.properties
          .find((property: MetaPropertyInfo) => property.name === propertyName)?.type;

        if (nestedEntityName) {
          if (propertyInfo.cardinality === 'ONE_TO_ONE') {
            return <NestedEntityField nestedEntityName={nestedEntityName}
                                      nestedEntityView={nestedEntityView}
                                      {...(rest as Partial<NestedEntityFieldProps>)}
            />;
          }

          if (propertyInfo.cardinality === 'ONE_TO_MANY') {
            return <NestedEntitiesTableField nestedEntityName={nestedEntityName}
                                             nestedEntityView={nestedEntityView}
                                             parentEntityName={entityName}
                                             parentEntityInstanceId={parentEntityInstanceId}
                                             {...(rest as Partial<NestedEntitiesTableFieldProps>)}
            />;
          }
        }
      }
      return null;
  }
  switch (propertyInfo.type as PropertyType) {
    case 'boolean':
      return <Checkbox {...(rest as CheckboxProps)}/>;
    case 'date':
    case 'localDate':
      return <DatePicker {...(rest as DatePickerProps)}/>;
    case 'dateTime':
    case 'localDateTime':
    case 'offsetDateTime':
      return <DatePicker showTime={true} {...(rest as DatePickerProps & {showTime?: boolean | object})}/>;
    case 'time':
    case 'localTime':
    case 'offsetTime':
      return <TimePicker {...(rest as TimePickerProps)}/>;
    case 'int':
      return <IntegerInput {...(rest as InputNumberProps)}/>;
    case 'double':
      return <DoubleInput {...(rest as InputNumberProps)}/>;
    case 'long':
      return <LongInput {...(rest as InputNumberProps)}/>;
    case 'decimal':
      return <BigDecimalInput {...(rest as InputNumberProps)}/>;
    case 'uuid':
      return <UuidInput {...(rest as InputProps)}/>
  }
  return <Input {...(rest as InputProps)}/>;
})));

type EnumFieldProps = MainStoreInjected & SelectProps<SelectValue> & {
  enumClass: string;
};

export const EnumField = injectMainStore(observer(({enumClass, mainStore, ...rest}: EnumFieldProps) => {
  let enumValues: EnumValueInfo[] = [];
  if (mainStore!.enums != null) {
    const enumInfo = mainStore!.enums.find((enm: EnumInfo) => enm.name === enumClass);
    if (enumInfo != null) {
      enumValues = enumInfo.values;
    }
  }
  return <Select {...rest} >
    {enumValues.map(enumValue =>
      <Select.Option key={enumValue.name} value={enumValue.name}>{enumValue.caption}</Select.Option>
    )}
  </Select>
}));

function getSelectMode(cardinality: Cardinality): "default" | "multiple" {
  if (cardinality === "ONE_TO_MANY" || cardinality === "MANY_TO_MANY") {
    return "multiple"
  }
  return "default";
}

function getAllowClear(propertyInfo: MetaPropertyInfo): boolean {
  return !propertyInfo.mandatory;
}

export interface NestedEntityFieldProps extends MainStoreInjected, WrappedComponentProps {
  /**
   * Сoming from antd Form field decorator
   */
  value?: any;
  /**
   * Сoming from antd Form field decorator
   */
  onChange?: (value: any) => void;
  /**
   * Name of the nested entity
   */
  nestedEntityName: string;
  /**
   * Name of the view that will be used for the nested entity
   */
  nestedEntityView: string;
}

type AssociationOptionsReactionData = [
  string[],
  IObservableArray<MetaClassInfo> | undefined,
  boolean | undefined
];

@injectMainStore
@observer
class NestedEntityFieldComponent extends React.Component<NestedEntityFieldProps> {

  @observable isDrawerOpen = false;
  @observable fields: string[] = [];
  @observable dataInstance: DataInstanceStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined> = new Map();

  @computed get instanceName(): string | undefined {
    const {intl} = this.props;

    const instanceName = this.dataInstance?.item?._instanceName;
    if (instanceName) {
      return instanceName;
    }

    // TODO Add the possibility to get the rules for instance name construction via REST API
    // TODO Update the name based on the obtained rules instead of using placeholder
    return intl.formatMessage({id: 'common.unsavedEntity'});
  }

  reactionDisposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    const {nestedEntityName, nestedEntityView} = this.props;

    this.dataInstance = instance(nestedEntityName, {view: nestedEntityView});
    this.loadViewPropertyNames(nestedEntityName, nestedEntityView)
      ?.then((propertyNames: string[]) => {
        this.fields = propertyNames;
      });

    this.reactionDisposers.push(reaction(
      () => [
        this.fields,
        this.props.mainStore?.metadata,
        this.props.mainStore?.security.isDataLoaded
      ] as AssociationOptionsReactionData,
      ([fields, metadata, isDataLoaded]: AssociationOptionsReactionData, thisReaction) => {
        if (fields.length > 0 && metadata != null && isDataLoaded && this.props.mainStore != null) {
          const {getAttributePermission} = this.props.mainStore.security;
          const entityProperties: MetaPropertyInfo[] = getEntityProperties(nestedEntityName, fields, metadata);
          // Performs HTTP requests:
          this.associationOptions = loadAllAssociationOptions(entityProperties, nestedEntityName, getAttributePermission);
          thisReaction.dispose();
        }
      },
      {fireImmediately: true}
    ));

    this.reactionDisposers.push(reaction(
      () => this.props.value,
      () => {
        if (this.props.value == null) {
          this.dataInstance?.setItem({});
        } else {
          const id = this.dataInstance?.item?.id;
          this.dataInstance?.setItemToFormFields(this.props.value);
          if (id != null && this.dataInstance?.item != null) {
            this.dataInstance.item.id = id;
          }
        }
      },
      {fireImmediately: true}
    ));
  }

  componentWillUnmount(): void {
    this.reactionDisposers.forEach(dispose => dispose());
  }

  loadViewPropertyNames = (entityName: string, viewName: string) => {
    return getCubaREST()?.loadEntityView(entityName, viewName)
      .then((view: View) => {
        return view.properties.map((viewProperty: ViewProperty) => {
          return (typeof viewProperty === 'string') ? viewProperty : viewProperty.name;
        });
      });
  };

  get isCreateMode(): boolean {
    return this.props.value == null;
  }

  get isEditMode(): boolean {
    return this.props.value != null;
  }

  showDeletionDialog = () => {
    const {intl} = this.props;

    Modal.confirm({
      title: intl.formatMessage({id: "cubaReact.nestedEntityField.delete.areYouSure"}),
      okText: intl.formatMessage({id: "common.ok"}),
      cancelText: intl.formatMessage({id: "common.cancel"}),
      onOk: this.deleteEntity
    });
  };

  deleteEntity = () => {
    const {onChange} = this.props;
    if (onChange) {
      onChange(undefined); // clear value in parent form
    }
  };

  openDrawer = () => {
    this.isDrawerOpen = true
  };

  closeDrawer = () => {
    this.isDrawerOpen = false;
  };

  handleSubmit = (fieldValues: {[field: string]: any}) => {
    const {onChange} = this.props;

    if (onChange) {
      onChange(fieldValues); // send value to parent form
    }

    this.closeDrawer();
  };

  render() {
    const {mainStore, nestedEntityName} = this.props;

    if (!mainStore?.isEntityDataLoaded() || !this.dataInstance) {
      return <Spin size='small'/>;
    }

    return <>
      {this.isCreateMode && (
        <Button type='link'
                onClick={this.openDrawer}
        >
          <FormattedMessage id='cubaReact.nestedEntityField.create' />
        </Button>
      )}
      {this.isEditMode && (
        <span>
          <span>{this.instanceName}</span>
          <DeleteOutlined
            className='cuba-nested-entity-editor-icon'
            onClick={this.showDeletionDialog} />
          <EditOutlined className='cuba-nested-entity-editor-icon' onClick={this.openDrawer} />
        </span>
      )}
      <Drawer visible={this.isDrawerOpen}
              width='90%'
              onClose={this.closeDrawer}
      >
        <EntityEditor entityName={nestedEntityName}
                      fields={this.fields}
                      dataInstance={this.dataInstance}
                      associationOptions={this.associationOptions}
                      onSubmit={this.handleSubmit}
                      onCancel={this.closeDrawer}
                      submitButtonText='common.ok'
        />
      </Drawer>
    </>;
  }
}

const NestedEntityField = injectIntl(NestedEntityFieldComponent);
export {NestedEntityField};

export interface NestedEntitiesTableFieldProps extends MainStoreInjected, WrappedComponentProps {
  /**
   * Сoming from antd Form field decorator
   */
  value?: any;
  /**
   * Сoming from antd Form field decorator
   */
  onChange?: (value: any) => void;
  /**
   * Name of the nested entity
   */
  nestedEntityName: string;
  /**
   * Name of the view that will be used for the nested entity
   */
  nestedEntityView: string;
  /**
   * Name of the parent entity
   */
  parentEntityName: string;
  /**
   * Instance id of the parent entity. `undefined` means that the parent entity has not been persisted yet.
   */
  parentEntityInstanceId?: string;
}

@injectMainStore
@observer
class NestedEntitiesTableFieldComponent extends React.Component<NestedEntitiesTableFieldProps> {

  @observable selectedRowKey: string | undefined;
  @observable isDrawerOpen = false;
  @observable allFields: string[] | undefined;
  @observable editorFields: string[] | undefined;
  @observable tableFields: string[] | undefined;
  @observable inverseAttributeName: string | undefined;
  @observable dataCollection: ClientSideDataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable editedInstance: DataInstanceStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined> = new Map();

  disposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    const {nestedEntityName, nestedEntityView, parentEntityName, mainStore} = this.props;

    this.dataCollection = clientSideCollection(nestedEntityName, {loadImmediately: false});

    // HTTP request
    if (this.allFields == null) {
      getCubaREST()?.loadEntityView(nestedEntityName, nestedEntityView)
        .then((view: View) => {
          this.allFields = view.properties.map((viewProp: ViewProperty) => {
            if (typeof viewProp === 'string') {
              return viewProp;
            }
            return viewProp.name;
          });
        });
    }

    this.disposers.push(reaction(
      () => this.props.value,
      () => {
        if (this.dataCollection) {
          this.dataCollection.allItems = this.props.value.map((element: any) => {
            return {
              id: generateTemporaryEntityId(),
              ...formFieldsToInstanceItem(element, nestedEntityName, mainStore!.metadata!)
            };
          });
          this.dataCollection.adjustItems();
        }
      }
    ));

    // Performs several HTTP requests (one per each one-to-many association).
    // That should happen only once after the requests to load permissions and entity view and metadata are resolved.
    this.disposers.push(reaction(
      () => [
        this.allFields,
        this.props.mainStore?.metadata,
        this.props.mainStore?.security.isDataLoaded
      ] as AssociationOptionsReactionData,
      ([allFields, metadata, isDataLoaded]: AssociationOptionsReactionData, thisReaction) => {
        if (allFields != null && metadata != null && isDataLoaded === true && this.props.mainStore != null) {
          const {getAttributePermission} = this.props.mainStore.security;
          const entityProperties: MetaPropertyInfo[] = getEntityProperties(nestedEntityName, allFields, metadata);
          // Performs HTTP requests:
          this.associationOptions = loadAllAssociationOptions(entityProperties, nestedEntityName, getAttributePermission);
          thisReaction.dispose();
        }
      },
      {fireImmediately: true}
    ));

    this.disposers.push(reaction(
      () => [this.allFields, this.props.mainStore?.metadata],
      (_data, thisReaction) => {
        if (this.allFields != null
          && this.allFields.length > 0
          && this.props.mainStore?.metadata != null
        ) {
          const entityProperties: MetaPropertyInfo[] =
            getEntityProperties(nestedEntityName, this.allFields, this.props.mainStore?.metadata);
          this.inverseAttributeName = entityProperties
            .find(property => property.type === parentEntityName)
            ?.name;
          const propertiesExceptInverseAttr = entityProperties
            .filter(property => property.type !== parentEntityName);
          this.editorFields = propertiesExceptInverseAttr
            .map(property => property.name)
            .sort();
          this.tableFields = propertiesExceptInverseAttr
            .filter(property => {
              // TODO Currently we cannot display relation fields in a nested table as we don't know instance names at this point
              // TODO (value coming from antd Form only contains ids)
              return property.attributeType !== 'ASSOCIATION' && property.attributeType !== 'COMPOSITION';
            })
            .map(property => property.name)
            .sort();
          thisReaction.dispose();
        }
      }
    ));
  }

  componentWillUnmount(): void {
    this.disposers.forEach(dispose => dispose());
  }

  createEntity = () => {
    const {nestedEntityName, intl} = this.props;
    this.editedInstance = instance(nestedEntityName, {});
    const newItem: any = {
      _instanceName: intl.formatMessage({id: 'common.unsavedEntity'}),
    };
    this.editedInstance?.setItem(newItem);
    this.openDrawer();
  };

  editEntity = () => {
    const {nestedEntityName} = this.props;
    this.editedInstance = instance(nestedEntityName, {});
    const record = this.dataCollection?.items.find((item: WithId) => item.id === this.selectedRowKey);
    this.editedInstance?.setItem(record);
    this.openDrawer();
  };

  openDrawer = () => {
    this.isDrawerOpen = true
  };

  closeDrawer = () => {
    this.isDrawerOpen = false;
  };

  showDeletionDialog = () => {
    const {intl} = this.props;

    Modal.confirm({
      title: intl.formatMessage({ id: "cubaReact.nestedEntitiesTableField.delete.areYouSure" }),
      okText: intl.formatMessage({id: "common.ok"}),
      cancelText: intl.formatMessage({id: "common.cancel"}),
      onOk: () => {
        const record = this.dataCollection?.items.find((item: WithId) => item.id === this.selectedRowKey);
        if (record) {
          this.dataCollection?.delete(record);
        }
        this.selectedRowKey = undefined;
        this.updateFormFieldValue();
      }
    });
  };

  /**
   * Submitting created/edited table item
   *
   * @param updatedValues
   */
  handleSubmitInstance = (updatedValues: {[field: string]: any}) => {
    const {parentEntityInstanceId} = this.props;

    if (this.editedInstance?.item?.id != null) {
      // We are editing existing nested entity (loaded from server or created client-side)
      // Update this.editedInstance.item - this includes data transformation from Form fields to REST API format
      const instanceId = this.editedInstance?.item?.id;

      const patch: any = {id: instanceId, ...updatedValues};
      if (this.inverseAttributeName != null && parentEntityInstanceId != null) {
        // parentEntityInstanceId indicates that the parent entity has been persisted already
        patch[this.inverseAttributeName] = parentEntityInstanceId;
      }

      this.editedInstance?.setItemToFormFields(patch);
      // Put updated item into dataCollection
      const index = this.dataCollection?.allItems.findIndex((item: WithId) => {
        return item.id === instanceId;
      });
      if (index != null && index > -1 && this.dataCollection != null) {
        this.dataCollection.allItems[index] = this.editedInstance?.item;
      }
    } else {
      // We are creating a new nested entity
      const patch: any = {id: generateTemporaryEntityId(), ...updatedValues};
      if (this.inverseAttributeName != null && parentEntityInstanceId != null) {
        // parentEntityInstanceId indicates that the parent entity has been persisted already
        patch[this.inverseAttributeName] = parentEntityInstanceId;
      }
      // Update this.editedInstance.item - this includes data transformation from Form fields to REST API format
      this.editedInstance?.setItemToFormFields(patch);
      // Put updated item into dataCollection
      this.dataCollection?.allItems.push(this.editedInstance?.item || {});
    }

    this.dataCollection?.adjustItems();
    this.updateFormFieldValue();
    this.closeDrawer();
  };

  updateFormFieldValue = () => {
    const {onChange, nestedEntityName, mainStore} = this.props;

    if (onChange) {
      const newValue = this.dataCollection?.allItems.map(item => {
        const id = item.id;
        const formFields = instanceItemToFormFields(item, nestedEntityName, toJS(mainStore!.metadata!), this.allFields || []);
        if (id != null) {
          formFields.id = id;
        } else {
          formFields.id = generateTemporaryEntityId();
        }
        return formFields;
      });

      onChange(newValue);
    }
  };

  handleRowSelectionChange = (selectedRowKeys: string[]) => {
    this.selectedRowKey = toJS(selectedRowKeys)[0];
  };

  render() {
    const {nestedEntityName, mainStore} = this.props;

    if (!mainStore?.isEntityDataLoaded() || this.dataCollection == null || this.editorFields == null) {
      return <Spin size='small'/>;
    }

    return (
      <>
        <div className='cuba-nested-entity-editor-buttons'>
          <Button
            htmlType="button"
            className='button'
            type="primary"
            icon={<PlusOutlined />}
            key='create'
            onClick={this.createEntity}
          >
            <span>
              <FormattedMessage id="common.create" />
            </span>
          </Button>
          <Button
            htmlType="button"
            className='button'
            disabled={!this.selectedRowKey}
            type="default"
            key='edit'
            onClick={this.editEntity}
          >
            <FormattedMessage id="common.edit" />
          </Button>
          <Button
            htmlType="button"
            className='button'
            disabled={!this.selectedRowKey}
            onClick={this.showDeletionDialog}
            key="remove"
            type="default"
          >
            <FormattedMessage id="common.remove" />
          </Button>
        </div>
        <DataTable dataCollection={this.dataCollection}
                   columnDefinitions={this.tableFields}
                   hideSelectionColumn={true}
                   onRowSelectionChange={this.handleRowSelectionChange}
                   enableFiltersOnColumns={[]} // TODO Remove once client-side filtering is implemented
        />
        <Drawer visible={this.isDrawerOpen}
                width='90%'
                onClose={this.closeDrawer}
        >
          {this.editedInstance &&
          <EntityEditor entityName={nestedEntityName}
                        fields={this.editorFields}
                        dataInstance={this.editedInstance}
                        associationOptions={this.associationOptions}
                        onSubmit={this.handleSubmitInstance}
                        onCancel={this.closeDrawer}
                        submitButtonText='common.ok'
          />}
        </Drawer>
      </>
    );
  }
}

const NestedEntitiesTableField = injectIntl(NestedEntitiesTableFieldComponent);
export {NestedEntitiesTableField};

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
  associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined>;
  /**
   * A callback that is executed when the form is submitted.
   * Execution happens only after a successful client-side validation.
   * This prop can be used to override the default behavior which is to send
   * a request to REST API to update the entity.
   *
   * @param fieldValues - the values of antd {@link https://ant.design/components/form/ Form} fields.
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
class EntityEditorComponent extends React.Component<EntityEditorProps> {

  @observable globalErrors: string[] = [];
  @observable formRef: RefObject<FormInstance> = React.createRef<FormInstance>();

  reactionDisposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    this.reactionDisposers.push(reaction(
      () => [this.props.dataInstance, this.formRef.current],
      () => {
        if (this.formRef.current != null) {
          this.formRef.current.resetFields();
          this.formRef.current.setFieldsValue(
            this.props.dataInstance.getFieldValues(this.props.fields)
          );
        }
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

  handleFinish = (values: {[field: string]: any}) => {
    const {onSubmit, dataInstance, intl} = this.props;
    if (onSubmit) {
      onSubmit(values);
    } else {
      if (this.formRef.current != null) {
        defaultHandleFinish(values, dataInstance, intl, this.formRef.current).then(({globalErrors}) => {
          this.globalErrors = globalErrors;
        });
      }
    }
  };

  handleFinishFailed = () => {
    const {intl} = this.props;
    message.error(intl.formatMessage({id: "management.editor.validationError"}));
  };

  getOptionsContainer = (entityName: string): DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined => {
    const {associationOptions} = this.props;
    return associationOptions.get(entityName);
  };

  getFormItemProps = (property: MetaPropertyInfo): FormItemProps => {
    const formItemProps: FormItemProps = {
      style: { marginBottom: "12px" }
    };

    if (property.mandatory) {
      formItemProps.rules = [{required: true}];
    }
    if (property.type === 'boolean') {
      formItemProps.valuePropName = 'checked';
    }

    return formItemProps;
  };

  render() {
    const {mainStore, dataInstance, onCancel, submitButtonText, intl} = this.props;

    if (!mainStore?.isEntityDataLoaded()) { return <Spinner/> }

    const {status} = dataInstance;

    return (
      <Card className="narrow-layout">
        <Form onFinish={this.handleFinish}
              onFinishFailed={this.handleFinishFailed}
              layout="vertical"
              className={'cuba-entity-editor'}
              ref={this.formRef}
              validateMessages={createAntdFormValidationMessages(intl)}
        >
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
              <FormattedMessage id="common.cancel" />
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={status !== "DONE" && status !== "ERROR"}
              loading={status === "LOADING"}
              className='submitbutton'
            >
              <FormattedMessage id={submitButtonText || 'common.submit'} />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  renderFields() {
    const {entityName} = this.props;

    return this.entityProperties.map(property => {
      return (
        <Field
          entityName={entityName}
          propertyName={property.name}
          key={property.name}
          formItemProps={this.getFormItemProps(property)}
          optionsContainer={this.getOptionsContainer(property.type)}
          disabled={property.readOnly}
        />
      );
    });
  }

}

export const defaultHandleFinish = <E extends unknown>(
  values: Record<string, any>,
  dataInstance: DataInstanceStore<E>,
  intl: IntlShape,
  formInstance: FormInstance,
  commitMode?: CommitMode,
): Promise<{success: boolean, globalErrors: string[]}> => {
  clearFieldErrors(formInstance);

  return dataInstance
    .update(values, commitMode)
    .then(() => {
      message.success(intl.formatMessage({ id: "management.editor.success" }));
      return {success: true, globalErrors: []};
    })
    .catch((serverError: any) => {
      if (serverError.response && typeof serverError.response.json === "function") {
        return serverError.response.json().then((response: any) => {
          const {globalErrors, fieldErrors} = extractServerValidationErrors(response);
          if (fieldErrors.size > 0) {
            formInstance.setFields(constructFieldsWithErrors(fieldErrors, formInstance));
          }

          if (fieldErrors.size > 0 || globalErrors.length > 0) {
            message.error(intl.formatMessage({id: "management.editor.validationError"}));
          } else {
            message.error(intl.formatMessage({id: "management.editor.error"}));
          }

          return {success: false, globalErrors};
        });
      } else {
        message.error(
          intl.formatMessage({ id: "management.editor.error" })
        );
        return {success: false, globalErrors: []};
      }
    });
};

const EntityEditor = injectIntl<'intl', EntityEditorProps>(EntityEditorComponent);

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
