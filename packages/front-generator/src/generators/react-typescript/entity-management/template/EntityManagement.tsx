import {<%=className%>Store} from "./<%=className%>Store";
import * as React from "react";
import {RouteComponentProps} from "react-router";
import {inject, observer, Provider} from "mobx-react";
import <%=className%>Editor from "./<%=className%>Editor";
import {<%=className%>Browser} from "./<%=className%>Browser";
import {AppState, AppStateObserver} from "<%= relDirShift %>app/AppState";

type Props = AppStateObserver & RouteComponentProps<{entityId?: string}>;

@inject(AppState.NAME)
@observer
export class <%=className%> extends React.Component<Props> {

  static PATH = '/<%=nameLiteral%>';
  static NEW_SUBPATH = 'new';

  store: <%=className%>Store;

  constructor(props: Props) {
    super(props);
    this.store = new <%=className%>Store(this.props.appState!);
  }

  render() {
    const {entityId} = this.props.match.params;
    return (
      <Provider {...{[<%=className%>Store.NAME]: this.store}}>
        {entityId
          ? <<%=className%>Editor entityId={entityId}/>
          : <<%=className%>Browser/>}
      </Provider>
    )
  }
}

export interface <%=className%>StoreObserver {
  <%=nameLiteral%>Store?: <%=className%>Store;
}