import * as React from "react";<% if (listType === 'table') { %>
import {observable} from 'mobx';<% } %>
import {observer} from "mobx-react";
import {
  Modal, Button,<% if (listType === 'cards') { %>
  Card, Icon, Spin,<% } else if (listType === 'list') { %>
  List, Icon, Spin,<% } %>
} from "antd";
import {<%=entity.className%>} from "<%= relDirShift %><%=entity.path%>";
import {Link} from "react-router-dom";
import {
  collection,<% if (listType === 'table') { %>
  DataTable, injectMainStore, MainStoreInjected,<% } else { %>
  EntityProperty,<% } %>
} from "@cuba-platform/react";
import {SerializedEntity} from "@cuba-platform/rest";
import {<%=className%>} from "./<%=className%>";
<% if (listType === 'table') { %>
@injectMainStore<% } %>
@observer<% if (listType === 'table') { %>
export class <%=listComponentName%> extends React.Component<MainStoreInjected> {<% } else { %>
export class <%=listComponentName%> extends React.Component {<% } %>

  dataCollection = collection<<%=entity.className%>>(<%=entity.className%>.NAME, {view: '<%=listView.name%>', sort: '-updateTs'});
  fields = [<%listView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];
<% if (listType === 'table') { %>
  @observable selectedRowId: string | undefined;
<% } %>
  showDeletionDialog = (e: SerializedEntity<<%=entity.className%>>) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${e._instanceName}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {<% if (listType === 'table') { %>
        this.selectedRowId = undefined;<% } %>
        return this.dataCollection.delete(e);
      }
    });
  };
<% if (listType === 'table') { %>
  render() {
    const buttons = (
      [
        (<Link to={<%=className%>.PATH + '/' + <%=className%>.NEW_SUBPATH} key='create'>
          <Button htmlType='button'
                  style={{margin: '0 12px 12px 0'}}
                  type='default'>
            Create
          </Button>
        </Link>),
        (<Link to={<%=className%>.PATH + '/' + this.selectedRowId} key='edit'>
          <Button htmlType='button'
                  style={{margin: '0 12px 12px 0'}}
                  disabled={!this.selectedRowId}
                  type='default'>
            Edit
          </Button>
        </Link>),
        (<Button htmlType='button'
                 style={{margin: '0 12px 12px 0'}}
                 disabled={!this.selectedRowId}
                 onClick={this.deleteSelectedRow}
                 key='remove'
                 type='default'>
          Remove
        </Button>),
      ]
    );

    return (
      <DataTable dataCollection={this.dataCollection}
                 fields={this.fields}
                 onSelectedRowChange={this.onSelectedRowChange}
                 buttons={buttons}
                 defaultSort={'-updateTs'}
      />
    );
  }

  getRecordById(id: string): SerializedEntity<<%=entity.className%>> {
    const record: SerializedEntity<<%=entity.className%>> | undefined =
      this.dataCollection.items.find(record => record.id === id);

    if (!record) {
      throw new Error('Cannot find entity with id ' + id);
    }

    return record;
  }

  onSelectedRowChange = (selectedRowId: string) => {
    this.selectedRowId = selectedRowId;
  };

  deleteSelectedRow = () => {
    this.showDeletionDialog(this.getRecordById(this.selectedRowId!));
  };  
<% } else { %>
  render() {
    const {
      status,
      items
    } = this.dataCollection;

    if (status === "LOADING") {
      return (<div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <Spin size='large'/>
      </div>);
    }

    return (
      <div>
        <div style={{marginBottom: '12px'}}>
          <Link to={<%=className%>.PATH + '/' + <%=className%>.NEW_SUBPATH}>
            <Button htmlType='button'
                    type='default'>
                    Create
            </Button>
          </Link>
        </div>
        {items == null || items.length === 0 ?
          <p>No items available</p> : null}
        <% if (listType === 'list') { %>
         <List itemLayout="horizontal"
            bordered
            dataSource={items}
            renderItem={item =>
              <List.Item actions={[
                  <Icon type='delete'
                        key='delete'
                        onClick={() => this.showDeletionDialog(item)}/>,
                  <Link to={<%=className%>.PATH + '/' + item.id} key='edit'>
                    <Icon type='edit'/>
                  </Link>
              ]}>
                <div style={{flexGrow: 1}}>
                {this.fields.map(p =>
                  <EntityProperty entityName={<%=entity.className%>.NAME}
                                  propertyName={p}
                                  value={item[p]}
                                  key={p}/>
                )}
                </div>
              </List.Item>
            }/>
        <% } else { %>
        {items.map(e =>
          <Card title={e._instanceName}
                key={e.id}
                style={{marginBottom: '12px'}}
                actions={[
                  <Icon type='delete'
                        key='delete'
                        onClick={() => this.showDeletionDialog(e)}/>,
                  <Link to={<%=className%>.PATH + '/' + e.id} key='edit'>
                    <Icon type='edit'/>
                  </Link>
                ]}>
                {this.fields.map(p =>
                  <EntityProperty entityName={<%=entity.className%>.NAME}
                                  propertyName={p}
                                  value={e[p]}
                                  key={p}/>
                )}
          </Card>
        )}
        <% } %>
      </div>
    )
  }
<% } %>
}
