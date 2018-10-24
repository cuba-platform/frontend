import * as React from "react";
import {inject, observer} from "mobx-react";
import {Button, Card, Icon, Modal} from "antd";
import {<%=className%>, <%=className%>StoreObserver} from "./<%=className%>";
import {Browse<%=entity.className%>Part, <%=className%>Store} from "./<%=className%>Store";
import {Link} from "react-router-dom";
import {EntityProperty} from "<%= relDirShift %>app/common/EntityProperty";

@inject(<%=className%>Store.NAME)
@observer
export class <%=className%>Browser extends React.Component<<%=className%>StoreObserver> {

  showDeletionDialog = (e: Browse<%=entity.className%>Part) => {
    Modal.confirm({
      title: `Are you sure you want to delete ${e._instanceName}?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => {
        return this.props.<%=nameLiteral%>Store!.deleteEntity(e);
      }
    });
  };

  render() {
    const {
      initializing,
      isLoadingList,
      entityList,
      moreEntitiesAvailable,
      isEmpty,
      loadMore,
    } = this.props.<%=nameLiteral%>Store!;

    if (initializing) {
      return <Icon type='spin'/>
    }

    return (
      <div>
        <div style={{marginBottom: '12px', textAlign: 'right'}}>
          <Link to={<%=className%>.PATH + '/' + <%=className%>.NEW_SUBPATH}>
            <Icon type='plus-circle' style={{fontSize: '24px'}}/>
          </Link>
        </div>
        {isEmpty ?
          <p>No items available</p> : null}
        {entityList.map(e =>
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
                {Browse<%=entity.className%>Part.PROPERTIES.map(p =>
                  <EntityProperty entityName={Browse<%=entity.className%>Part.ENTITY_NAME}
                                  propertyName={p}
                                  value={e[p]}
                                  key={p}/>
                )}
          </Card>
        )}
        {moreEntitiesAvailable ?
          <Button htmlType='button'
                  block={true}
                  loading={isLoadingList}
                  onClick={loadMore}>
            Load More
          </Button> : null
        }
      </div>
    )
  }
}
