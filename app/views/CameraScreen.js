import React from 'react';
import {
    StatusBar,
    CameraRoll,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    BackHandler
} from 'react-native';
import { Camera, Permissions, takeSnapshotAsync } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

import Slider from 'react-native-slider';

import {
    shotsDefaultInterval,
    shotstInervalMin,
    shotsIntervalMax,
    shotsIntervalStep
} from '../config';

import CameraText from '../components/CameraText';
import CameraHeader from '../components/CameraHeader';
import Loader from '../components/Loader';

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
        alignItems: 'flex-end',
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
    },

    sliderView: {
        flex: 1,
        width: '60%',
        alignSelf: 'flex-end',
        marginTop: 0,
        paddingLeft: 10,
        paddingRight: 10
    }
});

class Shots extends React.Component {
    render() {
        return (
            <View style={styles.shotsView}>
                <CameraHeader>
                    {`${this.props.shotsTaken}/${this.props.shotsToTake}`}
                </CameraHeader>
            </View>
        );
    }
}

class TopToolbar extends React.Component {
    render() {
        let cameraTypeName = this.props.type === Camera.Constants.Type.back ?
            'rear' :
            'front';

        // Camera.Constants.FlashMode.torch is used instead of
        // Camera.Constants.FlashMode.on - see below for details
        let flashModeName = 'off';
        switch (this.props.flashMode) {
            case Camera.Constants.FlashMode.off:
                flashModeName = 'off';
                break;

            case Camera.Constants.FlashMode.torch:
                flashModeName = 'on';
                break;
        }

        return (
            <View style={styles.toolbars}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View
                        style={{ height: 90 }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            height: 100,
                        }}>
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
                            <View style={styles.topToolbarButtons}>
                                <TouchableOpacity
                                    onPress={() => { this.props.setTimerSliderVisibility() }}>
                                    <MaterialIcons
                                        name='timer'
                                        size={32}
                                        color='white' />
                                    <CameraText style={{
                                        alignSelf: 'center',
                                        marginLeft: 5,
                                    }}>
                                        {`${this.props.shotsInterval / 1000}s`}
                                    </CameraText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.sliderView}>
                        {this.props.timerSliderVisibility ?
                            (<Slider
                                minimumValue={shotstInervalMin}
                                maximumValue={shotsIntervalMax}
                                step={shotsIntervalStep}
                                value={this.props.shotsInterval}
                                thumbTintColor='#fff'
                                minimumTrackTintColor='#fff'
                                maximumTrackTintColor='#ccc'
                                onValueChange={this.props.setShotsInterval}
                            />) :
                            null}
                    </View>
                </View>
            </View >
        );
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
            </View>
        );
    }
}

export default class CameraScreen extends React.Component {
    state = {
        cameraRollUri: null,
        hasCameraPermission: null,
        hasCameraRollPermissions: null,
        type: Camera.Constants.Type.back,
        flashMode: Camera.Constants.FlashMode.off,
        shotsInterval: shotsDefaultInterval,
        timerSliderVisibility: false,
    };

    setTimerSliderVisibility = (visibility, a) => {
        if (visibility === undefined) {
            this.setState((prevState) =>
                ({ timerSliderVisibility: !prevState.timerSliderVisibility }));
        }
        else {
            this.setState({ timerSliderVisibility: visibility });
        }
    }

    toggleCamera = () => {
        this.props.toggleCamera();
        this.props.setLoading(false);
    }

    stopShootingSession = (reason) => {
        clearInterval(this._interval);
        this._interval = null;

        this.props.setLoading(true);
        setTimeout(this.toggleCamera, 500);
        console.log(`taking shots stopped for reason: ${reason}`);
    }

    shoot = async () => {
        // TODO - alerts are not the way to go since they can pop up
        // every x seconds AFTER the shooting session has finished
        this.camera.takePictureAsync()
            .then(async data => {
                this.props.addShotUri(data.uri);
            })
            .catch(err => {
                console.log(`Camera error: ${err}`);
                Alert.alert('Something happened, camera cannot take photo.');
            });

        console.log(`took shot N: ${this.props.shotsTaken}; fired at: ${Date.now() / 1000}`);
        this.props.incShots();
    }

    startShootingSession = async () => {
        if (this.camera) {
            if (this._interval) {
                this.stopShootingSession('user stopped');
            }
            else {
                // The timing issue seems to be relevant only for a
                // presumably cluttered (android) phone; on another device
                // this works flawlessly
                //
                // The first shot is taken very fast,
                // then the rest are taken after 1.5 seconds
                // setTimeout seems to be worse, although this.shoot 
                // takes less than 2ms to fire; view ## Timing in README for details
                this.shoot();
                this._interval = setInterval(() => {
                    if (this.props.shotsTaken === this.props.shotsToTake) {
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
        this.setState((prevState) => ({
            type: prevState.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        }));
    }

    toggleFlashMode = () => {
        this.setState((prevState) => {
            let flashMode;
            switch (prevState.flashMode) {
                case Camera.Constants.FlashMode.off:
                    flashMode = Camera.Constants.FlashMode.torch;
                    break;

                case Camera.Constants.FlashMode.torch:
                    flashMode = Camera.Constants.FlashMode.off;
                    break;
            }

            return { flashMode: flashMode };
        });
    }

    setShotsInterval = (shotsInterval) => {
        this.setState({ shotsInterval });
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
                        // Use Camera.Constants.FlashMode.torch instead of Camera.Constants.FlashMode.auto
                        // since when taking shots fast the flash cannot keep up;
                        // while preparing the flash should be turned off;
                        // once the shooting begins take the real value (which could be torch)
                        flashMode={this._interval ? this.state.flashMode : Camera.Constants.FlashMode.off}
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
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setTimerSliderVisibility(false);
                        }}>
                        <View
                            style={{
                                position: 'absolute',
                                top: 0, bottom: 0,
                                left: 0, right: 0
                            }}>
                            {this.props.loading
                                ?
                                <Loader></Loader>
                                :
                                <View style={{ flex: 1 }}>
                                    {this._interval
                                        ?
                                        <Shots
                                            shotsTaken={this.props.shotsTaken}
                                            shotsToTake={this.props.shotsToTake}>
                                        </Shots>
                                        :
                                        <TopToolbar
                                            type={this.state.type}
                                            flashMode={this.state.flashMode}
                                            shotsInterval={this.state.shotsInterval}
                                            timerSliderVisibility={this.state.timerSliderVisibility}
                                            flipCamera={this.flipCamera}
                                            toggleFlashMode={this.toggleFlashMode}
                                            setShotsInterval={this.setShotsInterval}
                                            setTimerSliderVisibility={this.setTimerSliderVisibility}>
                                        </TopToolbar>}
                                    <BottomToolbar startShootingSession={this.startShootingSession}>
                                    </BottomToolbar>
                                </View>}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        } else {
            return <Text>No access to camera or camera roll!</Text>;
        }
    }
}
