import {LogoutOutlined} from '@ant-design/icons';
import {Button, Modal} from "antd";
import * as React from "react";
import {observer} from "mobx-react";
import './AppHeader.css';
import {injectMainStore, MainStoreInjected} from "@haulmont/jmix-react-core";
import {LanguageSwitcher} from '../../i18n/LanguageSwitcher';
import {injectIntl, WrappedComponentProps} from 'react-intl';
import JmixLightIcon from '../icons/JmixLightIcon';

@injectMainStore
@observer
class AppHeader extends React.Component<MainStoreInjected & WrappedComponentProps> {

  render() {
    const appState = this.props.mainStore!;

    return (
      <div className="app-header">
        <JmixLightIcon className="app-header__icon" />

        <div className="user-panel">
          <LanguageSwitcher className='panelelement language-switcher -header'/>
          <span className="panelelement">{appState.userName}</span>
          <Button className="panelelement"
                  id='button_logout'
                  ghost={true}
                  icon={<LogoutOutlined />}
                  onClick={this.showLogoutConfirm}/>
        </div>
      </div>
    );
  }

  showLogoutConfirm = () => {
    Modal.confirm({
      title: this.props.intl.formatMessage({id: 'header.logout.areYouSure'}),
      okText: this.props.intl.formatMessage({id: 'header.logout.ok'}),
      cancelText: this.props.intl.formatMessage({id: 'header.logout.cancel'}),
      onOk: () => {
        this.props.mainStore!.logout()
      }
    });
  }

}

export default injectIntl(AppHeader);
