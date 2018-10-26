import React from 'react';
import {
  YellowBox,
  View
} from 'react-native';

import Expo from 'expo';

import FSCamera from './app/views/FSCamera';

// ignore warnings about remote debugger while... developing
YellowBox.ignoreWarnings(['Remote debugger']);

export default class App extends React.Component {
  constructor() {
    super();
    // app.json does not seem to be enough for changing the orientation
    Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.ALL)
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}>
        <FSCamera></FSCamera>
      </View>
    );
  }
}
