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

const styles = StyleSheet.create({
    topToolbar: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    topToolbarButtons: {
        flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    topToolbarButtonsText: {
        fontSize: 18,
        marginTop: 30,
        color: 'white'
    }
});

class TopToolbar extends React.Component {
    render() {
        return (
            <View
                style={styles.topToolbar}>
                <TouchableOpacity
                    style={styles.topToolbarButtons}
                    onPress={this.props.flipCamera}>
                    <Text style={styles.topToolbarButtonsText}>
                        Flip
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.topToolbarButtons}
                    onPress={this.props.toggleFlashMode}>
                    <Text style={styles.topToolbarButtonsText}>
                        {`Flash - ${this.props.flashMode} `}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.topToolbarButtons}
                    onPress={this.props.startShootingSession}>
                    <Text style={styles.topToolbarButtonsText}>
                        Shoot
                    </Text>
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
                const [_, err] = await to(CameraRoll.saveToCameraRoll(data.uri, "photo"));
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
                // todo - the first shoot is taken very fast,
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
        // keep Permissions separate, won't work on iOS otherwise
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
                        flashMode={this.state.flashMode}>
                        <TopToolbar
                            type={this.state.type}
                            flashMode={this.state.flashMode}
                            flipCamera={this.flipCamera}
                            toggleFlashMode={this.toggleFlashMode}
                            startShootingSession={this.startShootingSession}>
                        </TopToolbar>
                    </Camera>
                </View>
            );
        } else {
            return <Text>No access to camera or camera roll!</Text>;
        }
    }
}
