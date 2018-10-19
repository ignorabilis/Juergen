import React from 'react';
import { YellowBox } from 'react-native';
import FSCamera from './app/views/FSCamera';

// ignore warnings about remote debugger while... developing
YellowBox.ignoreWarnings(['Remote debugger']);

export default class App extends React.Component {
  render() {
    return (
      <FSCamera></FSCamera>
    );
  }
}
