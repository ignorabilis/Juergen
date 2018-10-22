import React from 'react';
import { View } from 'react-native';
import { shotsToTake } from '../config';

import CameraScreen from './CameraScreen';
import CameraRollScreen from './CameraRollScreen';

export default class FSCamera extends React.Component {
  state = {
    shotsTaken: 0,
    shotsToTake: shotsToTake,
    showCamera: true,
    shotsUris: [],
  };

  incShots = () => {
    this.setState({ shotsTaken: this.state.shotsTaken + 1 });
  }

  addShotUri = (shotUri) => {
    this.setState({
      shotsUris: [...this.state.shotsUris, shotUri]
    });
  }

  resetShots = () => {
    this.setState({ shotsTaken: 0, shotsUris: [] });
  }

  toggleCamera = () => {
    this.setState({ showCamera: !this.state.showCamera })
  }

  render() {
    // Do not unmount the Camera - 
    // takePictureAsync promise will not return anything 
    // (the promise will not be resolved/rejected) if there is no Camera
    return (
      <View style={{ flex: 1 }}>
        <View
          // ~~ is used to convert true/false to 1/0
          style={{
            flex: ~~this.state.showCamera
          }}>
          <CameraScreen
            shotsTaken={this.state.shotsTaken}
            shotsToTake={this.state.shotsToTake}
            incShots={this.incShots}
            addShotUri={this.addShotUri}
            toggleCamera={this.toggleCamera}></CameraScreen>
        </View>
        <View
          // ~~ is used to convert true/false to 1/0
          style={{
            flex: ~~!this.state.showCamera,
          }}>
          <CameraRollScreen
            shotsUris={this.state.shotsUris}
            resetShots={this.resetShots}
            toggleCamera={this.toggleCamera}></CameraRollScreen>
        </View>
      </View>
    );
  }
}
