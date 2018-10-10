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


export class CameraView extends React.Component {
    state = {
        cameraRollUri: null,
        hasCameraPermission: null,
        hasCameraRollPermissions: null,
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
        if (this.camera) {
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
