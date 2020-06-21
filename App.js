/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };

    setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }

  render() {
    return (
      <Text style={{ fontSize: 50 }}>
        {this.props.mode == 'date'
          ? 'Data: ' + this.state.date.toLocaleDateString()
          : 'Hora: ' + this.state.date.toLocaleTimeString()}
      </Text>
    );
  }
}

const App: () => React$Node = () => {
  return (
    <>
      <View style={styles.app}>
        <Clock mode="date" />
        <Clock mode="hour" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  app: {
    backgroundColor: 'rgb(74, 64, 255)',
  },
  component: {
    color: 'blue',
    fontSize: 45,
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default App;
