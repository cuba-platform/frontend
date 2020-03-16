import React from 'react';
import {DataTable} from '../..';
import {
  collection,
  DataCollectionStore,
  MainStoreInjected,
  WithId,
  DataInstanceStore,
  injectMainStore,
  instance,
  generateTemporaryEntityId,
  getCubaREST,
  instanceItemToFormFields,
  formFieldsToInstanceItem
} from '@cuba-platform/react-core';
import {SerializedEntityProps, MetaPropertyInfo, View, ViewProperty} from '@cuba-platform/rest';
import {IReactionDisposer, observable, reaction, toJS} from 'mobx';
import {observer} from 'mobx-react';
import {Button, Drawer, Modal, Spin} from 'antd';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import './NestedEntitiesTableField.less';
import {EntityEditor, getEntityProperties} from '../EntityEditor';
import { loadAssociationOptions } from '../../util/ui-model';

export type NestedEntitiesTableFieldProps = MainStoreInjected & WrappedComponentProps & {
  value?: any; // coming from Ant Design form field decorator
  onChange?: (value: any) => void; // coming from Ant Design form field decorator
  nestedEntityName: string;
  nestedEntityView: string;
  parentEntityName: string;
}

@injectMainStore
@observer
class NestedEntitiesTableFieldComponent extends React.Component<NestedEntitiesTableFieldProps> {

  @observable selectedRowKey: string | undefined;
  @observable isDrawerOpen = false;
  @observable allFields: string[] | undefined;
  @observable editorFields: string[] | undefined;
  @observable tableFields: string[] | undefined;
  @observable dataCollection: DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable editedInstance: DataInstanceStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>>> = new Map();

  fieldsDataRequested = false;
  disposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    const {nestedEntityName, nestedEntityView, parentEntityName, mainStore} = this.props;

    this.dataCollection = collection(nestedEntityName, {
      loadImmediately: false,
      mode: 'client'
    });

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
          this.dataCollection.filterAndSortItems();
        }
      }
    ));

    // Performs several HTTP requests (one per each one-to-many association).
    // That should happen only once after requests to load the entity view and metadata are resolved.
    this.disposers.push(reaction(
      () => [this.allFields, this.props.mainStore?.metadata],
      () => {
        if (!this.fieldsDataRequested
          && this.allFields != null
          && this.allFields.length > 0
          && this.props.mainStore?.metadata != null
        ) {
          const entityProperties: MetaPropertyInfo[] =
            getEntityProperties(nestedEntityName, this.allFields, this.props.mainStore?.metadata);
          this.associationOptions = loadAssociationOptions(entityProperties); // Performs HTTP requests, async
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
          this.fieldsDataRequested = true;
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
    if (this.editedInstance?.item?.id != null) {
      // We are editing existing entity (loaded from server or created client-side)
      // Update this.editedInstance.item - this includes data transformation from Form fields to REST API format
      const instanceId = this.editedInstance?.item?.id;
      this.editedInstance?.setItemToFormFields({id: instanceId, ...updatedValues});
      // Put updated item into dataCollection
      const index = this.dataCollection?.allItems.findIndex((item: WithId) => {
        return item.id === instanceId;
      });
      if (index != null && index > -1 && this.dataCollection != null) {
        this.dataCollection.allItems[index] = this.editedInstance?.item;
      }
    } else {
      // We are creating a new entity
      // Update this.editedInstance.item - this includes data transformation from Form fields to REST API format
      this.editedInstance?.setItemToFormFields({id: generateTemporaryEntityId(), ...updatedValues});
      // Put updated item into dataCollection
      this.dataCollection?.allItems.push(this.editedInstance?.item || {});
    }

    this.dataCollection?.filterAndSortItems();
    this.updateFormFieldValue();
    this.closeDrawer();
  };

  updateFormFieldValue = () => {
    const {onChange, nestedEntityName, mainStore} = this.props;

    if (onChange) {
      const newValue = this.dataCollection?.allItems.map(item => {
        const formFields = instanceItemToFormFields(item, nestedEntityName, toJS(mainStore!.metadata!), this.allFields || []);
        if (formFields != null && !('id' in formFields)) {
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
            icon="plus"
            key='create'
            onClick={this.createEntity}
          >
            <span>
              <FormattedMessage id="management.browser.create" />
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
            <FormattedMessage id="management.browser.edit" />
          </Button>
          <Button
            htmlType="button"
            className='button'
            disabled={!this.selectedRowKey}
            onClick={this.showDeletionDialog}
            key="remove"
            type="default"
          >
            <FormattedMessage id="management.browser.remove" />
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
          />}
        </Drawer>
      </>
    );
  }
}

const NestedEntitiesTableField = injectIntl(NestedEntitiesTableFieldComponent);
export {NestedEntitiesTableField};
