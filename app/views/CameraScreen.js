import React from 'react';
import {
    Button,
    TextButton,
    CameraRoll,
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Camera, Permissions, Constants, takeSnapshotAsync } from 'expo';

const shotsToTake = 3;
const shotsInterval = 1000;

export class CameraView extends React.Component {
    state = {
        cameraRollUri: null,
        hasCameraPermission: null,
        hasCameraRollPermissions: null,
        _shotsTaken: 0,
        type: Camera.Constants.Type.back,
    };

    _saveToCameraRollAsync = async () => {
        let result = await takeSnapshotAsync(this._container, {
            format: 'png',
            result: 'file',
        });

        let saveResult = await CameraRoll.saveToCameraRoll(result, 'photo');
        this.setState({ cameraRollUri: saveResult });
    };

    // TODO - check for possible exceptions + handle these errors
    // probably with an alert for the most common one
    // and another one to catch all else
    snap = async () => {
        console.log(this.state._shotsTaken);
        if (this.camera) {
            if (this._interval) {
                clearInterval(this._interval);
                this._interval = null;
                console.log('taking shots stopped by user')
            }
            else {
                this._interval = setInterval(() => {

                    if (this.state._shotsTaken === shotsToTake) {
                        clearInterval(this._interval);
                        this._interval = null;
                        console.log('all shots taken')
                    }
                    else {
                        this.setState({ _shotsTaken: this.state._shotsTaken + 1 })
                        console.log(`taking shot N: ${this.state._shotsTaken}`)
                        this.camera.takePictureAsync()
                            .then(data => {
                                CameraRoll.saveToCameraRoll(data.uri, "photo")
                                    .then(data => {
                                        console.log("Saved to camera roll.");
                                    })
                                    .catch(err => {
                                        console.log(`Camera Roll error: ${err}`);
                                    });
                            })
                            .catch(err => {
                                console.log(`Camera error: ${err}`);
                            });
                    }
                }, shotsInterval)
            }
        }
    }

    async componentWillMount() {
        // keep Permissions separate, won't work on iOS otherwise
        const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: camera === 'granted' });
        this.setState({ hasCameraRollPermissions: roll === 'granted' });

        const { hasCameraPermission,
            hasCameraRollPermissions } = this.state;
        console.log(`camera: ${hasCameraPermission}, roll: ${hasCameraRollPermissions}`)
    }

    componentWillUnmount() {

    }

    render() {
        const { hasCameraPermission,
            hasCameraRollPermissions } = this.state;
        if (hasCameraPermission === null ||
            hasCameraRollPermissions === null) {
            return <View />;
        } else if (hasCameraPermission && hasCameraRollPermissions) {
            return (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={ref => { this.camera = ref; }}
                        style={{ flex: 1 }}
                        type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 50, color: 'white' }}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flex: 0.5,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={this.snap}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 50, color: 'white' }}>
                                    {'    '}Snap{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            );
        } else {
            return <Text>No access to camera or camera roll!</Text>;
        }
    }
}
