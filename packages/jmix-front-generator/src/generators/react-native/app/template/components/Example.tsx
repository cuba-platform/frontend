import React, {Component} from 'react';
import {StyleSheet, Text} from "react-native";
import {observer} from "mobx-react";

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  }
});

@observer
export class Example extends Component {

  render() {
    return (
      <Text style={styles.title}>Welcome to <%=project.name%>!</Text>
    );
  }
}
