import React, { Component } from "react";
import { injectMainStore, MainStoreInjected } from "@haulmont/jmix-react-core";
import { observer } from "mobx-react";
import { Login } from "./Login";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Example } from "./Example";
import { PrimaryButton } from "./PrimaryButton";
import { observable } from "mobx";
import { colors } from "../styles/palette";

@injectMainStore
@observer
export class Root extends Component<MainStoreInjected> {
  @observable loggingOut = false;

  render() {
    const { initialized, authenticated } = this.props.mainStore;

    if (!initialized) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      );
    }

    if (!authenticated) {
      return (
        <Login onLoginSubmit={(l, p) => this.props.mainStore.login(l, p)} />
      );
    }

    return (
      <View style={styles.container}>
        <Example />
        <PrimaryButton
          onPress={this.logout}
          loading={this.loggingOut}
          style={styles.logoutButton}
        >
          Log out
        </PrimaryButton>
      </View>
    );
  }

  logout = () => {
    this.loggingOut = true;
    this.props.mainStore.logout().finally(() => {
      this.loggingOut = false;
    });
  };
}

const styles = StyleSheet.create({
  container: {
    margin: 16
  },
  loader: {
    flex: 1,
    justifyContent: "center"
  },
  logoutButton: {
    marginTop: 16
  }
});
