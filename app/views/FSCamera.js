import React from 'react';
import { View } from 'react-native';
import { shotsToTake } from '../config';

import CameraScreen from './CameraScreen';
import CameraRollScreen from './CameraRollScreen';

export default class FSCamera extends React.Component {
  state = {
    shotsTaken: 0,
    shotsToTake: shotsToTake,
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

  render() {
    // ~~ is used to convert true/false to 1/0
    let cameraRollScreen = this.state.shotsTaken === this.state.shotsToTake;
    // Do not unmount the Camera - 
    // takePictureAsync promise will not return anything 
    // (the promise will not be resolved/rejected) if there is no Camera
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: ~~!cameraRollScreen,
            //opacity: ~~!cameraRollScreen 
          }}>
          <CameraScreen
            shotsTaken={this.state.shotsTaken}
            shotsToTake={this.state.shotsToTake}
            incShots={this.incShots}
            addShotUri={this.addShotUri}></CameraScreen>
        </View>
        <View
          style={{
            flex: ~~cameraRollScreen,
            //opacity: ~~cameraRollScreen
          }}>
          <CameraRollScreen
            shotsUris={this.state.shotsUris}
            resetShots={this.resetShots}></CameraRollScreen>
        </View>
      </View>
    );
  }
}
