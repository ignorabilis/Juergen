import React from 'react';
import {
    StatusBar,
    CameraRoll,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Camera, Permissions, takeSnapshotAsync } from 'expo';
import to from '../../utils/to'
import { MaterialIcons } from '@expo/vector-icons'

const styles = StyleSheet.create({
    toolbars: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    topToolbarButtons: {
        flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginTop: 30,
    },

    shotsView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    shotsText: {
        fontSize: 38,
        color: 'white',
        alignSelf: 'flex-end',
        marginTop: 30,
        marginRight: 30,
    },

    shutterToolbar: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        marginBottom: 50,
    },
    outerShutterButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2,
        justifyContent: 'center',
    },
    innerShutterButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 2,
        alignSelf: 'center',
    }
});

class Shots extends React.Component {
    render() {
        return (
            <View style={styles.shotsView}>
                <Text style={styles.shotsText}>
                    {`${this.props.shotsTaken}/${this.props.shotsToTake}`}
                </Text>
            </View>
        );
    }
}

class TopToolbar extends React.Component {
    render() {
        let cameraTypeName = this.props.type === Camera.Constants.Type.back ?
            'rear' :
            'front';

        let flashModeName = 'off';
        switch (this.props.flashMode) {
            case Camera.Constants.FlashMode.off:
                flashModeName = 'off';
                break;

            case Camera.Constants.FlashMode.auto:
                flashModeName = 'auto';
                break;

            case Camera.Constants.FlashMode.on:
                flashModeName = 'on';
                break;
        }

        return (
            <View style={styles.toolbars}>
                <TouchableOpacity
                    style={styles.topToolbarButtons}
                    onPress={this.props.toggleFlashMode}>
                    <MaterialIcons
                        name={`flash-${flashModeName}`}
                        size={32}
                        color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.topToolbarButtons}
                    onPress={this.props.flipCamera}>
                    <MaterialIcons
                        name={`camera-${cameraTypeName}`}
                        size={32}
                        color='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.topToolbarButtons}>
                    <MaterialIcons
                        name='timer'
                        size={32}
                        color='white' />
                </TouchableOpacity>
            </View >
        )
    }
}

class BottomToolbar extends React.Component {
    render() {
        return (
            <View style={styles.toolbars}>
                <TouchableOpacity
                    style={styles.shutterToolbar}
                    onPress={this.props.startShootingSession}>
                    <View style={styles.outerShutterButton}>
                        <View style={styles.innerShutterButton}></View>
                    </View>
                </TouchableOpacity>
            </View >
        )
    }
}

export class CameraView extends React.Component {
    state = {
        cameraRollUri: null,
        hasCameraPermission: null,
        hasCameraRollPermissions: null,
        type: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        shotsTaken: 0,
        shotsToTake: 7,
        shotsInterval: 300,
    };

    stopShootingSession = (reason) => {
        clearInterval(this._interval);
        this._interval = null;
        this.setState({ shotsTaken: 0 });

        console.log(`taking shots stopped for reason: ${reason}`);
    }

    shoot = async () => {
        let taken = this.state.shotsTaken + 1;
        this.setState({ shotsTaken: taken });

        console.log(`taking shot N: ${taken}; fired at: ${Date.now() / 1000}`);

        // todo - alerts are not the way to go since they can pop up
        // every x seconds AFTER the shooting session has finished
        this.camera.takePictureAsync()
            .then(async data => {
                const [_, err] = await to(CameraRoll.saveToCameraRoll(data.uri, 'photo'));
                if (err) {
                    console.log(`Camera Roll error: ${err}`);
                    Alert.alert('Something happened, cannot save to camera roll.');
                }
            })
            .catch(err => {
                console.log(`Camera error: ${err}`);
                Alert.alert('Something happened, camera cannot take photo.');
            });
    }

    startShootingSession = async () => {
        if (this.camera) {
            if (this._interval) {
                this.stopShootingSession('user stopped');
            }
            else {
                // todo - the first shot is taken very fast,
                // then the rest are taken after 1.5 seconds
                // setTimeout seems to be worse, although this.shoot 
                // takes less than 2ms to fire; view ## Timing in README for details
                this.shoot();
                this._interval = setInterval(() => {
                    if (this.state.shotsTaken === this.state.shotsToTake) {
                        this.stopShootingSession('all shots taken');
                    }
                    else {
                        this.shoot();
                    }
                }, this.state.shotsInterval);
            }
        }
    }

    flipCamera = () => {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        });
    }

    toggleFlashMode = () => {
        let flashMode;
        switch (this.state.flashMode) {
            case Camera.Constants.FlashMode.off:
                flashMode = Camera.Constants.FlashMode.auto;
                break;

            case Camera.Constants.FlashMode.auto:
                flashMode = Camera.Constants.FlashMode.on;
                break;

            case Camera.Constants.FlashMode.on:
                flashMode = Camera.Constants.FlashMode.off;
                break;
        }
        this.setState({
            flashMode: flashMode
        });
    }

    async componentWillMount() {
        // !iOS - keep Permissions separate, won't work on iOS otherwise
        const { status: camera } = await Permissions.askAsync(Permissions.CAMERA);
        const { status: roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: camera === 'granted' });
        this.setState({ hasCameraRollPermissions: roll === 'granted' });

        const { hasCameraPermission,
            hasCameraRollPermissions } = this.state;

        console.log(`camera: ${hasCameraPermission}, roll: ${hasCameraRollPermissions}`);
    }

    componentWillUnmount() {
        this.stopShootingSession('user navigated away');
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
                    <StatusBar hidden={true} />
                    <Camera
                        ref={ref => { this.camera = ref; }}
                        style={{ flex: 1 }}
                        type={this.state.type}
                        flashMode={this.state.flashMode}
                        // The ratio will match the dimensions of the view you place the Camera component in.
                        // So to set it to the device screen just use 16:9
                        // !iOS - this setting is ignored, it should work out-of-the-box
                        ratio={'16:9'}>
                    </Camera>
                    {/* This below - position: 'absolute' - looks ugly, but is needed:
                        conditional rendering inside the camera breakes the camera.
                        The first time TopToolbar changes to Shots the camera turns black
                        and no photos are taken. This seems to be an issue with the 
                        Camera component itself. */}
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                        {this._interval ?
                            <Shots
                                shotsTaken={this.state.shotsTaken}
                                shotsToTake={this.state.shotsToTake}>
                            </Shots>
                            :
                            <TopToolbar
                                type={this.state.type}
                                flashMode={this.state.flashMode}
                                flipCamera={this.flipCamera}
                                toggleFlashMode={this.toggleFlashMode}>
                            </TopToolbar>}
                        <BottomToolbar startShootingSession={this.startShootingSession}>
                        </BottomToolbar>
                    </View>
                </View>
            );
        } else {
            return <Text>No access to camera or camera roll!</Text>;
        }
    }
}
