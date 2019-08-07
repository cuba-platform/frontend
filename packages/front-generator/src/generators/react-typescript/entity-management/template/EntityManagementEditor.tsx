import * as React from "react";
import {FormEvent} from "react";
import {Button, Form, message} from "antd";
import {observer} from "mobx-react";
import {<%=className%>} from "./<%=className%>";
import {FormComponentProps} from "antd/lib/form";
import {Link, Redirect} from "react-router-dom";
import {IReactionDisposer, observable, reaction} from "mobx";
import {FormField, instance, Msg} from "@cuba-platform/react";
import {<%=entity.className%>} from "<%= relDirShift %>cuba/entities/<%=entity.name%>";

type Props = FormComponentProps & {
  entityId: string;
};


@observer
class <%=className%>Editor extends React.Component<Props> {

  dataInstance = instance(<%=entity.className%>.NAME, {view: '<%=editView.name%>', loadImmediately: false});
  @observable
  updated = false;
  reactionDisposer: IReactionDisposer;

  fields = [<%editView.allProperties.forEach(p => {%>'<%=p.name%>',<%})%>];

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.dataInstance.update(this.props.form.getFieldsValue(this.fields))
      .then(() => {
        message.success('Entity has been updated');
        this.setState({updated: true});
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
      <Form onSubmit={this.handleSubmit}
            layout='vertical'>
        {this.fields.map(propName =>
          <Form.Item label={<Msg entityName={<%=entity.className%>.NAME} propertyName={propName} />}
                     key={propName}
                     style={{marginBottom: '12px'}}>{
            getFieldDecorator(propName)(
              <FormField entityName={<%=entity.className%>.NAME}
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
                  disabled={status !== "DONE"}
                  loading={status === "LOADING"}
                  style={{marginLeft: '8px'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  componentDidMount() {
    if (this.props.entityId !== <%=className%>.NEW_SUBPATH) {
      this.dataInstance.load(this.props.entityId);
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