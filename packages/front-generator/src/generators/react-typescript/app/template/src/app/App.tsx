import * as React from 'react';
import './App.css';

import {Icon, Layout, Menu} from "antd";
import {observer} from "mobx-react";
import Login from "./login/Login";
import Centered from "./common/Centered";
import AppHeader from "./header/AppHeader";
import {NavLink, Route, Switch} from "react-router-dom";
import HomePage from "./home/HomePage";
import {mainRoutes} from "../routing";
import {injectMainStore, MainStoreInjected} from "@cuba-platform/react";
import {CenteredLoader} from './CenteredLoader';
import {FormattedMessage} from 'react-intl';

@injectMainStore
@observer
class App extends React.Component<MainStoreInjected> {

  render() {

    const mainStore = this.props.mainStore!;
    const {initialized, locale, loginRequired} = mainStore;

    if (!initialized || !locale) {
      return (
        <CenteredLoader/>
      )
    }

    if (loginRequired) {
      return (
        <Centered>
          <Login/>
        </Centered>
      )
    }

    return (
      <Layout className='main-layout'>
        <Layout.Header>
          <AppHeader/>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={200}
                        breakpoint='sm'
                        collapsedWidth={0}
                        style={{background: '#fff'}}>
            <Menu mode="inline"
                  style={{height: '100%', borderRight: 0}}>
              <Menu.Item key="1">
                <NavLink to={'/'}><Icon type="home"/>
                  <FormattedMessage id='router.home' />
                </NavLink>
              </Menu.Item>
              {mainRoutes.map((route) =>
                <Menu.Item key={route.menuLink}>
                  <NavLink to={route.menuLink}><Icon type="bars"/>
                    <FormattedMessage id={'router.' + route.caption} />
                  </NavLink>
                </Menu.Item>
              )}
            </Menu>
          </Layout.Sider>
          <Layout style={{ padding: '24px 24px 24px' }}>
            <Layout.Content>
              <Switch>
                <Route exact={true} path="/" component={HomePage}/>
                {mainRoutes.map((route) =>
                  <Route key={route.pathPattern} path={route.pathPattern} component={route.component}/>
                )}
              </Switch>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
