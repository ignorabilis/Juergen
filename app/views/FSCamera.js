import React from 'react';
import { View, BackHandler } from 'react-native';
import { shotsToTake } from '../config';

import CameraScreen from './CameraScreen';
import CameraRollScreen from './CameraRollScreen';

export default class FSCamera extends React.Component {
  state = {
    shotsTaken: 0,
    shotsToTake: shotsToTake,
    showCamera: true,
    shotsUris: [],
    loading: false,
  };

  incShots = () => {
    this.setState({ shotsTaken: this.state.shotsTaken + 1 });
  }

  addShotUri = (shotUri) => {
    this.setState({
      shotsUris: [...this.state.shotsUris, { shotUri: shotUri, keep: false }]
    });
  }

  resetShots = () => {
    this.setState({ shotsTaken: 0, shotsUris: [] });
  }

  toggleCamera = () => {
    this.setState({ showCamera: !this.state.showCamera });
  }

  setLoading = (loading) => {
    this.setState({ loading })
  }

  keepShot = (id) => {
    let shotsUris = [...this.state.shotsUris];
    shotsUris[id].keep = !shotsUris[id].keep;
    this.setState({ shotsUris });
  }

  handleBackPress = () => {
    console.log(this.props.showCamera);
    if (this.state.showCamera) {
      BackHandler.exitApp();
    }
    else {
      this.resetShots();
      this.toggleCamera();

      return true;
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
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
            loading={this.state.loading}
            incShots={this.incShots}
            addShotUri={this.addShotUri}
            toggleCamera={this.toggleCamera}
            setLoading={this.setLoading}></CameraScreen>
        </View>
        <View
          // ~~ is used to convert true/false to 1/0
          style={{
            flex: ~~!this.state.showCamera,
          }}>
          <CameraRollScreen
            shotsUris={this.state.shotsUris}
            resetShots={this.resetShots}
            toggleCamera={this.toggleCamera}
            keepShot={this.keepShot}>
          </CameraRollScreen>
        </View>
      </View>
    );
  }
}
