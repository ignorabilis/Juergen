import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './app/views/CameraScreen';
import CameraRollScreen from './app/views/CameraRollScreen';

export default class App extends React.Component {
  render() {
    return (
      // <CameraScreen></CameraScreen>
      <CameraRollScreen></CameraRollScreen>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
