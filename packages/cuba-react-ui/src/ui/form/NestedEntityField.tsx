import React from "react";
import {Button, Drawer, Icon, Modal, Spin} from "antd";
import {FormattedMessage, injectIntl, WrappedComponentProps} from "react-intl";
import {observer} from "mobx-react";
import {computed, IReactionDisposer, observable, reaction} from "mobx";
import {EntityEditor, getEntityProperties} from '../EntityEditor';
import {
  injectMainStore,
  MainStoreInjected,
  WithId,
  getCubaREST, DataInstanceStore, instance,
  DataCollectionStore
} from "@cuba-platform/react-core";
import './NestedEntityField.less';
import {SerializedEntityProps, MetaPropertyInfo, View, ViewProperty} from '@cuba-platform/rest';
import { loadAssociationOptions } from "../../util/ui-model";

export type NestedEntityFieldProps = MainStoreInjected & WrappedComponentProps & {
  value?: any; // coming from Ant Design form field decorator
  onChange?: (value: any) => void; // coming from Ant Design form field decorator
  nestedEntityName: string;
  nestedEntityView: string;
}

@injectMainStore
@observer
class NestedEntityFieldComponent extends React.Component<NestedEntityFieldProps> {

  @observable isDrawerOpen = false;
  @observable fields: string[] = [];
  @observable dataInstance: DataInstanceStore<Partial<WithId & SerializedEntityProps>> | undefined;
  @observable associationOptions: Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>>> = new Map();

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
        this.loadAssociationOptions();
      });

    this.reactionDisposers.push(reaction(
      () => this.props.value,
      () => {
        if (this.props.value == null) {
          this.dataInstance?.setItem({});
        } else {
          this.dataInstance?.setItemToFormFields(this.props.value);
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

  loadAssociationOptions = () => {
    this.associationOptions = loadAssociationOptions(this.entityProperties);
  };

  get entityProperties(): MetaPropertyInfo[] {
    const {mainStore, nestedEntityName} = this.props;
    return (mainStore?.metadata && this.fields.length > 0)
      ? getEntityProperties(nestedEntityName, this.fields, mainStore?.metadata)
      : [];
  }

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

    return (
      <>
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
            <Icon type='delete'
                  className='cuba-nested-entity-editor-icon'
                  onClick={this.showDeletionDialog}
            />
            <Icon type='edit'
                  className='cuba-nested-entity-editor-icon'
                  onClick={this.openDrawer}
            />
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
          />
        </Drawer>
      </>
    );
  }
}

const NestedEntityField = injectIntl(NestedEntityFieldComponent);
export {NestedEntityField};
