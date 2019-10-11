import * as React from "react";
import {FormEvent} from "react";
import {Button, Card, Form, message} from "antd";
import {observer} from "mobx-react";
import {<%=className%>} from "./<%=className%>";
import {FormComponentProps} from "antd/lib/form";
import {Link, Redirect} from "react-router-dom";
import {IReactionDisposer, observable, reaction} from "mobx";
import {<%if (Object.keys(editRelations).length > 0) {%>collection, <%}%>FormField, instance, Msg} from "@cuba-platform/react";
import {<%=entity.className%>} from "<%= relDirShift %><%=entity.path%>";
<%Object.values(editRelations).forEach(entity => {%>import {<%=entity.className%>} from "<%= relDirShift %><%=entity.path%>";
<%})%>

type Props = FormComponentProps & {
  entityId: string;
};


@observer
class <%=className%>Editor extends React.Component<Props> {

  dataInstance = instance<<%=entity.className%>>(<%=entity.className%>.NAME, {view: '<%=editView.name%>', loadImmediately: false});
  <%Object.entries(editRelations).forEach(([attrName, entity]) => {%><%=attrName%>sDc = collection<<%=entity.className%>>(<%=entity.className%>.NAME, {view: '_minimal'});
  <%})%>
  @observable
  updated = false;
  reactionDisposer: IReactionDisposer;

  fields = [<%editView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.dataInstance.update(this.props.form.getFieldsValue(this.fields))
      .then(() => {
        message.success('Entity has been updated');
        this.updated = true;
      })
      .catch(() => {
        alert('Error')
      });
  };

  render() {

    if (this.updated) {
      return <Redirect to={<%=className%>.PATH}/>
    }

    const {getFieldDecorator} = this.props.form;
    const {status} = this.dataInstance;

    return (
      <Card style={{margin:"0 auto", maxWidth: "1024px"}}>
        <Form onSubmit={this.handleSubmit}
              layout='vertical'>
          <%editAttributes.forEach(attr => {%>
          <Form.Item label={<Msg entityName={<%=entity.className%>.NAME} propertyName='<%=attr.name%>'/>}
                    key='<%=attr.name%>'
                    style={{marginBottom: '12px'}}>{
              getFieldDecorator('<%=attr.name%>', {<%if (attr.mandatory) {%>rules:[{required: true}],<%}%><%if (attr.type && attr.type.fqn === 'java.lang.Boolean') {%>valuePropName:"checked"<%}%>})(
                <FormField entityName={<%=entity.className%>.NAME}
                          propertyName='<%=attr.name%>'<%if (Object.keys(editRelations).includes(attr.name)) {%>
                          optionsContainer={this.<%=attr.name%>sDc}
                          <%}%>/>
              )}
          </Form.Item>
          <%})%>
          <Form.Item style={{textAlign: 'center'}}>
            <Link to={<%=className%>.PATH}>
              <Button htmlType="button">
                Cancel
              </Button>
            </Link>
            <Button type="primary"
                    htmlType="submit"
                    disabled={status !== "DONE" && status !== "ERROR"}
                    loading={status === "LOADING"}
                    style={{marginLeft: '8px'}}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

  componentDidMount() {
    if (this.props.entityId !== <%=className%>.NEW_SUBPATH) {
      this.dataInstance.load(this.props.entityId);
    } else {
      this.dataInstance.setItem(new <%=entity.className%>());
    }
    this.reactionDisposer = reaction(
      () => {
        return this.dataInstance.item
      },
      () => {
        this.props.form.setFieldsValue(this.dataInstance.getFieldValues(this.fields));
      }
    )
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

}

export default Form.create<Props>()(<%=className%>Editor);
