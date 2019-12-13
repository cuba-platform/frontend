import * as React from "react";
import "./App.css";

import { Icon, Layout, Menu } from "antd";
import { observer } from "mobx-react";
import Login from "./login/Login";
import Centered from "./common/Centered";
import AppHeader from "./header/AppHeader";
import { NavLink, Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";
import { menuItems } from "../routing";
import {
  injectMainStore,
  MainStoreInjected,
  RouteItem,
  SubMenu
} from "@cuba-platform/react";
import { CenteredLoader } from "./CenteredLoader";
import {
  FormattedMessage,
  injectIntl,
  IntlFormatters,
  WrappedComponentProps
} from "react-intl";

@injectMainStore
@observer
class AppComponent extends React.Component<
  MainStoreInjected & WrappedComponentProps
> {
  render() {
    const mainStore = this.props.mainStore!;
    const { initialized, locale, loginRequired } = mainStore;

    if (!initialized || !locale) {
      return <CenteredLoader />;
    }

    if (loginRequired) {
      return (
        <Centered>
          <Login />
        </Centered>
      );
    }

    return (
      <Layout className="main-layout">
        <Layout.Header>
          <AppHeader />
        </Layout.Header>
        <Layout>
          <Layout.Sider
            width={200}
            breakpoint="sm"
            collapsedWidth={0}
            style={{ background: "#fff" }}
          >
            <Menu mode="inline" style={{ height: "100%", borderRight: 0 }}>
              <Menu.Item key="1">
                <NavLink to={"/"}>
                  <Icon type="home" />
                  <FormattedMessage id="router.home" />
                </NavLink>
              </Menu.Item>
              {menuItems.map(item => menuItem(item, this.props.intl))}
            </Menu>
          </Layout.Sider>
          <Layout style={{ padding: "24px 24px 24px" }}>
            <Layout.Content>
              <Switch>
                <Route exact={true} path="/" component={HomePage} />
                {collectRouteItems(menuItems).map(route => (
                  <Route
                    key={route.pathPattern}
                    path={route.pathPattern}
                    component={route.component}
                  />
                ))}
              </Switch>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

function menuItem(item: RouteItem | SubMenu, intl: IntlFormatters) {

  // Sub Menu

  if ((item as any).items != null) {
    //recursively walk through sub menus
    return (
      <Menu.SubMenu
        title={intl.formatMessage({
          id: "router." + item.caption
        })}
      >
        {(item as SubMenu).items.map(ro => menuItem(ro, intl))}
      </Menu.SubMenu>
    );
  }

  // Route Item

  const { menuLink } = item as RouteItem;

  return (
    <Menu.Item key={menuLink}>
      <NavLink to={menuLink}>
        <Icon type="bars" />
        <FormattedMessage id={"router." + item.caption} />
      </NavLink>
    </Menu.Item>
  );
}

function collectRouteItems(items: Array<RouteItem | SubMenu>): RouteItem[] {
  return items.reduce(
    (acc, curr) => {
      if ((curr as SubMenu).items == null) {
        // Route item
        acc.push(curr as RouteItem);
      } else {
        // Items from sub menu
        acc.push(...collectRouteItems((curr as SubMenu).items));
      }
      return acc;
    },
    [] as Array<RouteItem>
  );
}

const App = injectIntl(AppComponent);
export default App;
