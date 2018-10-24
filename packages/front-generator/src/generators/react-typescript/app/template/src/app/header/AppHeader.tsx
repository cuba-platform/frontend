import {Button, Modal} from "antd";
import * as React from "react";
import {AppStateObserver, injectAppState} from "../AppState";
import {observer} from "mobx-react";
import './AppHeader.css';
import logo from './logo.png';

@injectAppState
@observer
class AppHeader extends React.Component<AppStateObserver> {

  render() {
    const appState = this.props.appState!;

    return (
      <div className="AppHeader">
        <div className="logo">
          <img src={logo}/>
        </div>
        <div className="user-info">
          <span>{appState.userName}</span>
          <Button ghost={true}
                  icon='logout'
                  style={{border: 0}}
                  onClick={this.showLogoutConfirm}/>
        </div>
      </div>
    )
  }

  showLogoutConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Logout',
      cancelText: 'Cancel',
      onOk: () => {
        this.props.appState!.logout()
      }
    });
  }

}

export default AppHeader;