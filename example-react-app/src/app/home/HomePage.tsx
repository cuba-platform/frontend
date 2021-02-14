import * as React from "react";
import { FormattedMessage } from "react-intl";

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <FormattedMessage id="home.welcome" /> scr-jmix!
      </div>
    );
  }
}

export default HomePage;
