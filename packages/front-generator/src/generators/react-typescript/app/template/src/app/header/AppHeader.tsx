import {Button, Modal} from "antd";
import * as React from "react";
import {observer} from "mobx-react";
import './AppHeader.css';
import logo from './logo.png';
import {injectMainStore, MainStoreInjected} from "@cuba-platform/react";

@injectMainStore
@observer
class AppHeader extends React.Component<MainStoreInjected> {

  render() {
    const appState = this.props.mainStore!;

    return (
      <div className="AppHeader">
        <div className="logo">
          <img src={logo} alt={'Logo'}/>
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
        this.props.mainStore!.logout()
      }
    });
  }

}

export default AppHeader;