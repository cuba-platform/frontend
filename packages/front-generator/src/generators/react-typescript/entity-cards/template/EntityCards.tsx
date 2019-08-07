import * as React from "react";
import {observer} from "mobx-react";
import {<%=entity.className%>} from "<%= relDirShift %>cuba/entities/<%=entity.name%>";
import {Card, Icon} from "antd";
import {collection, EntityProperty} from "@cuba-platform/react";

@observer
export class <%=className%> extends React.Component {

  dataCollection = collection<<%=entity.className%>>(<%=entity.className%>.NAME, {view: '<%=view.name%>'});
  fields = [<%view.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];

  render() {
  const {status, items} = this.dataCollection;

    if (status === "LOADING") {
      return <Icon type='spin'/>
    }

    return (
      <div>
        {items.map(e =>
          <Card title={e._instanceName}
                key={e.id}
                style={{marginBottom: '12px'}}>
            {this.fields.map(p =>
              <EntityProperty entityName={<%=entity.className%>.NAME}
                              propertyName={p}
                              value={e[p]}
                              key={p}/>
            )}
          </Card>
        )}
      </div>
    )
  }
}