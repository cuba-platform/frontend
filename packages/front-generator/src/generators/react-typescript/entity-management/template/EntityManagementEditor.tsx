import * as React from "react";
import {FormEvent} from "react";
import {Button, Form, message} from "antd";
import {inject, observer} from "mobx-react";
import {Edit<%=entity.className%>Part, <%=className%>Store} from "./<%=className%>Store";
import {<%=className%>, <%=className%>StoreObserver} from "./<%=className%>";
import {FormComponentProps} from "antd/lib/form";
import {Link, Redirect} from "react-router-dom";
import {IReactionDisposer, reaction} from "mobx";
import {FormField} from "<%= relDirShift %>app/common/FormField";
import {Msg} from "<%= relDirShift %>app/common/Msg";
import {AppStateObserver} from "<%= relDirShift %>app/AppState";

type Props = AppStateObserver & <%=className%>StoreObserver & FormComponentProps & {
  entityId: string;
};

type State = {
  updated?: boolean;
}

@inject(<%=className%>Store.NAME)
@observer
class <%=className%>Editor extends React.Component<Props, State> {

  private reactionDisposer: IReactionDisposer;

  state: State = {};

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.<%=nameLiteral%>Store!.updateEntity(this.props.form.getFieldsValue(Edit<%=entity.className%>Part.PROPERTIES))
      .then(() => {
        message.success('Entity has been updated');
        this.setState({updated: true});
      })
      .catch(() => {
        alert('Error')
      });
  };

  render() {

    if (this.state.updated) {
      return <Redirect to={<%=className%>.PATH}/>
    }

    const {getFieldDecorator} = this.props.form;
    const {isCommittingEntity, isLoadingEntity} = this.props.<%=nameLiteral%>Store!;

    return (
      <Form onSubmit={this.handleSubmit}
            layout='vertical'>
        {Edit<%=entity.className%>Part.PROPERTIES.map(propName =>
          <Form.Item label={<Msg entityName={Edit<%=entity.className%>Part.ENTITY_NAME} propertyName={propName} />}
                     key={propName}
                     style={{marginBottom: '12px'}}>{
            getFieldDecorator(propName)(
              <FormField entityName={Edit<%=entity.className%>Part.ENTITY_NAME}
                         propertyName={propName}/>
            )}
          </Form.Item>
        )}
        <Form.Item style={{textAlign: 'center'}}>
          <Link to={<%=className%>.PATH}>
            <Button htmlType="button">
              Cancel
            </Button>
          </Link>
          <Button type="primary"
                  htmlType="submit"
                  disabled={isCommittingEntity || isLoadingEntity}
                  loading={isCommittingEntity}
                  style={{marginLeft: '8px'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  componentDidMount() {
    if (this.props.entityId === <%=className%>.NEW_SUBPATH) {
      this.props.<%=nameLiteral%>Store!.createEntity();
    } else {
      this.props.<%=nameLiteral%>Store!.loadEntity(this.props.entityId);
    }
    this.reactionDisposer = reaction(
      () => this.props.<%=nameLiteral%>Store!.fieldValues,
      (fieldValues) => {
        this.props.form.setFieldsValue(fieldValues);
      }
    )
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

}

export default Form.create()(<%=className%>Editor);