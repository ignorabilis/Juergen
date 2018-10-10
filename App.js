import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CameraView } from './app/views/CameraScreen'

export default class App extends React.Component {
  render() {
    return (
      <CameraView></CameraView>
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
