import * as React from "react";
import {ChangeEvent, FormEvent} from "react";
import {Button, Form, Icon, Input, message} from "antd";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {AppStateObserver, injectAppState} from "../AppState";

@injectAppState
@observer
class Login extends React.Component<AppStateObserver> {

  @observable login: string;
  @observable password: string;
  @observable performingLoginRequest = false;

  @action
  changeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    this.login = e.target.value;
  };

  @action
  changePassword = (e: ChangeEvent<HTMLInputElement>) => {
    this.password = e.target.value;
  };

  @action
  doLogin = (e: FormEvent) => {
    e.preventDefault();
    this.performingLoginRequest = true;
    this.props.appState!.login(this.login, this.password)
      .then(action(() => {
        this.performingLoginRequest = false;
      }))
      .catch(action(() => {
        this.performingLoginRequest = false;
        message.error('login failed');
      }));
  };

  render() {
    return(
      <Form layout='vertical' onSubmit={this.doLogin}>
        <Form.Item>
          <Input placeholder='Login'
                 onChange={this.changeLogin}
                 value={this.login}
                 prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                 size='large'/>
        </Form.Item>
        <Form.Item>
          <Input placeholder='Password'
                 onChange={this.changePassword}
                 value={this.password}
                 type='password'
                 prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                 size='large'/>
        </Form.Item>
        <Form.Item>
          <Button type='primary'
                  htmlType='submit'
                  size='large'
                  block={true}
                  loading={this.performingLoginRequest}>
            Login
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Login;