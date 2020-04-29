import React, {Component} from 'react';
import {collection} from "@cuba-platform/react-core";
import {ActivityIndicator, ScrollView, StyleSheet, Text} from "react-native";
import {PredefinedView} from "@cuba-platform/rest";
import {observer} from "mobx-react";
import {colors} from '../styles/palette';
import {User, UserView} from '../cuba/entities/base/sec$User';

const styles = StyleSheet.create({
  list: {
    marginTop: 16,
  },
  item: {
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  }
});

@observer
export class Example extends Component {

  usersData = collection<UserView<'_base'>>(User.NAME, {view: PredefinedView.BASE});

  render() {

    const {status, items} = this.usersData;

    if (status !== "DONE") {
      return <ActivityIndicator color={colors.textPrimary} />;
    }

    return (
      <>
        <Text style={styles.title}>List of users:</Text>
        <ScrollView style={styles.list}>
          {items.map(item => (
            <Text style={styles.item} key={item.id}>
              {item._instanceName}
            </Text>
          ))}
        </ScrollView>
      </>
    );
  }
}
