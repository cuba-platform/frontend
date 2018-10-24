import * as React from "react";
import {inject, observer, Provider} from "mobx-react";
import {<%=entity.className%>Part, <%=className%>Store} from "./<%=className%>Store";
import {Button, Card, Icon} from "antd";
import {EntityProperty} from "<%= relDirShift %>app/common/EntityProperty";

@inject(<%=className%>Store.NAME)
@observer
export class <%=className%> extends React.Component<<%=className%>StoreConsumer> {

  render() {
    const {loading, initializing, entities, moreEntitiesAvailable, loadMore} = this.props.<%=nameLiteral%>Store!;

    if (initializing) {
      return <Icon type='spin'/>
    }

    return (
      <div>
        {entities.map(e =>
          <Card title={e._instanceName}
                key={e.id}
                style={{marginBottom: '12px'}}>
            {<%=entity.className%>Part.PROPERTIES.map(p =>
              <EntityProperty entityName={<%=entity.className%>Part.ENTITY_NAME}
                              propertyName={p}
                              value={e[p]}
                              key={p}/>
            )}
          </Card>
        )}
        {moreEntitiesAvailable ?
          <Button htmlType='button'
                  block={true}
                  loading={loading}
                  onClick={loadMore}>
            Load More
          </Button> : null
        }
      </div>
    )
  }
}

export interface <%=className%>StoreConsumer {
  <%=nameLiteral%>Store?: <%=className%>Store;
}

export class <%=className%>Page extends React.Component {

  store: <%=className%>Store;

  constructor(props: any) {
    super(props);
    this.store = new <%=className%>Store();
  }

  render() {
    return (
      <Provider {...{[<%=className%>Store.NAME]: this.store}}>
        <<%=className%>/>
      </Provider>
    )
  }
}