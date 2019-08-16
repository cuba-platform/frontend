import * as React from "react";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import <%=className%>Editor from "./<%=className%>Editor";
import {<%=className%>Browser} from "./<%=className%>Browser";

type Props = RouteComponentProps<{entityId?: string}>;

@observer
export class <%=className%> extends React.Component<Props> {

  static PATH = '/<%=nameLiteral%>';
  static NEW_SUBPATH = 'new';

  render() {
    const {entityId} = this.props.match.params;
    return (
      <>
        {entityId
          ? <<%=className%>Editor entityId={entityId}/>
          : <<%=className%>Browser/>}
      </>
    )
  }
}