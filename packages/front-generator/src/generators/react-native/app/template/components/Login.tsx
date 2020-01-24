import React, {Component} from 'react';
import {
  TextInput,
  Text,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  AsyncStorage,
} from "react-native";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {colors} from '../styles/palette';
import { PrimaryButton } from './PrimaryButton';
import {cubaREST, REST_TOKEN_STORAGE_KEY} from "../rest/rest";


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  header_title: {
    color: colors.textInverted,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8
  },
  header_subTitle: {
    color: colors.textInverted,
    fontSize: 18,
    textAlign: "center",
    paddingVertical: 8
  },
  form: {
    flex: 1.5,
    paddingVertical: 32,
  },
  form_globalError: {
    color: colors.error,
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 16
  },
  form_input: {
    color: colors.textPrimary,
    borderColor: colors.borders,
    fontSize: 18,
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginVertical: 8
  },
  form_input__invalid: {
    borderColor: colors.error
  },
  form_submitButton: {
    marginHorizontal: 16,
    marginTop: 8
  }
});

type Props = {
  onLoginSubmit: (login: string, password: string) => Promise<any>;
};

@observer
export class Login extends Component<Props> {

  @observable login = '';
  @observable password = '';
  @observable loading = false;

  @observable badCredentialsError = false;
  @observable serverError = false;

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <View style={styles.header}>
            <Text style={styles.header_title}>scr</Text>
            <Text style={styles.header_subTitle}>Sign in to your account</Text>
          </View>
          <View style={styles.form}>
            {this.badCredentialsError && (
              <Text style={styles.form_globalError}>
                Login failed. Unknown login or bad password.
              </Text>
            )}
            {this.serverError && (
              <Text style={styles.form_globalError}>Server error</Text>
            )}
            <TextInput style={[
                styles.form_input,
                this.badCredentialsError && styles.form_input__invalid
              ]}
              value={this.login}
              placeholder="Login"
              placeholderTextColor={colors.placeholders}
              onChangeText={this.onLoginChange}
              onSubmitEditing={this.onSubmit}
            />
            <TextInput style={[
                styles.form_input,
                this.badCredentialsError && styles.form_input__invalid
              ]}
              value={this.password}
              placeholder="Password"
              placeholderTextColor={colors.placeholders}
              secureTextEntry={true}
              onChangeText={this.onPasswordChange}
              onSubmitEditing={this.onSubmit}
            />
            <PrimaryButton onPress={this.onSubmit}
                           loading={this.loading}
                           style={styles.form_submitButton}
                           disabled={!this.isSubmitEnabled()}
            >
              Log in
            </PrimaryButton>
          </View>
      </KeyboardAvoidingView>
    );
  }

  onLoginChange = (login: string) => {
    this.badCredentialsError = false;
    this.login = login;
  };

  onPasswordChange = (password: string) => {
    this.badCredentialsError = false;
    this.password = password;
  };

  clearErrors = () => {
    this.badCredentialsError = false;
    this.serverError = false;
  };

  isSubmitEnabled = (): boolean => {
    return this.login.length > 0 && this.password.length > 0;
  };

  onSubmit = () => {
    if (!this.isSubmitEnabled) {
      return;
    }

    this.clearErrors();
    this.loading = true;

    this.props
      .onLoginSubmit(this.login, this.password)
      .then(_value => {
        return AsyncStorage.setItem(REST_TOKEN_STORAGE_KEY, cubaREST.restApiToken);
      })
      .catch(err => {
        if (err.response) {
          err.response.json().then((message) => {
            if (message.error === 'invalid_grant') {
              this.badCredentialsError = true;
            } else {
              this.serverError = true;
            }
          });
        } else {
          this.serverError = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  };

}
