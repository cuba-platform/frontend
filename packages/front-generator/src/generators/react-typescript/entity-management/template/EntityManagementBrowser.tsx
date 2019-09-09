import * as React from "react";
import {observer} from "mobx-react";
import {Card, List, Icon, Modal} from "antd";
import {<%=entity.className%>} from "<%= relDirShift %>cuba/entities/<%=entity.name%>";
import {Link} from "react-router-dom";
import {collection, EntityProperty} from "@cuba-platform/react";
import {SerializedEntity} from "@cuba-platform/rest";
import {<%=className%>} from "./<%=className%>";

@observer
export class <%=className%>Browser extends React.Component {

  dataCollection = collection<<%=entity.className%>>(<%=entity.className%>.NAME, {view: '<%=listView.name%>', sort: '-updateTs'});
  fields = [<%listView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];

  showDeletionDialog = (e: SerializedEntity<<%=entity.className%>>) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${e._instanceName}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        return this.dataCollection.delete(e);
      }
    });
  };

  render() {
    const {
      status,
      items
    } = this.dataCollection;

    if (status === "LOADING") {
      return <Icon type='spin'/>
    }

    return (
      <div>
        <div style={{marginBottom: '12px', textAlign: 'right'}}>
          <Link to={<%=className%>.PATH + '/' + <%=className%>.NEW_SUBPATH}>
            <Icon type='plus-circle' style={{fontSize: '24px'}}/>
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
}
