import React from 'react';
import { StyleSheet, Text, View, YellowBox } from 'react-native';
import _ from 'lodash';
import { Router } from "./Router";

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);

console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends React.Component {
  render() {
    return (
      <Router />
    );
  }
}
