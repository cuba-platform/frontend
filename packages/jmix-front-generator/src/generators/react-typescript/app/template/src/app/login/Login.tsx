import * as React from "react";
import {ChangeEvent} from "react";
import { Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Button, Input, message} from "antd";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import {injectMainStore, MainStoreInjected} from "@haulmont/jmix-react-core";
import './Login.css';
import {LanguageSwitcher} from '../../i18n/LanguageSwitcher';
import {FormattedMessage, injectIntl, WrappedComponentProps} from 'react-intl';
import JmixDarkIcon from '../icons/JmixDarkIcon';

@injectMainStore
@observer
class Login extends React.Component<MainStoreInjected & WrappedComponentProps> {

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
  doLogin = () => {
    this.performingLoginRequest = true;
    this.props.mainStore!.login(this.login, this.password)
      .then(action(() => {
        this.performingLoginRequest = false;
      }))
      .catch(action(() => {
        this.performingLoginRequest = false;
        message.error(this.props.intl.formatMessage({id: 'login.failed'}));
      }));
  };

  render() {
    return(
      <div className='login-form'>
        <JmixDarkIcon className='logo' />

        <div className='title'>
          <%= title %>
        </div>

        <Form layout='vertical' onFinish={this.doLogin}>
          <Form.Item>
            <Input id='input_login'
                   placeholder={this.props.intl.formatMessage({id: 'login.placeholder.login'})}
                   onChange={this.changeLogin}
                   value={this.login}
                   prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                   size='large'/>
          </Form.Item>
          <Form.Item>
            <Input id='input_password'
                   placeholder={this.props.intl.formatMessage({id: 'login.placeholder.password'})}
                   onChange={this.changePassword}
                   value={this.password}
                   type='password'
                   prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
                   size='large'/>
          </Form.Item>
          <Form.Item>
            <div className='language-switcher-container'>
              <LanguageSwitcher className='language-switcher' />
            </div>
          </Form.Item>
          <Form.Item>
            <Button type='primary'
                    htmlType='submit'
                    size='large'
                    block={true}
                    loading={this.performingLoginRequest}>
              <FormattedMessage id='login.loginBtn'/>
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default injectIntl(Login);
