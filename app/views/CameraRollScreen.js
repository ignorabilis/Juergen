import React from 'react';
import {
    StatusBar,
    CameraRoll,
    ImageBackground,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ImageSlider from 'react-native-image-slider';

import * as alerts from '../helpers/Alerts';
import to from '../../utils/to';

const styles = StyleSheet.create({
    contentText: { color: '#FFF' },

    topSection: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 20
    },
    bottomSection: {
        position: 'absolute',
        padding: 10,
        bottom: 0,
        left: 0,
        right: 0
    },

    saveToolbar: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    pagesToolbar: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    saveButtons: {
        margin: 8,
        marginRight: 24
    },
    pageButtons: {
        margin: 3,
        width: 20,
        height: 20,
        opacity: 0.9,
        alignItems: 'center',
        backgroundColor: 'white',
        marginRight: 5,
        borderRadius: 10
    },
    pageButtonsText: {
        fontSize: 14,
        color: 'black',
    },
    pageButtonSelected: {
        opacity: 1,
        backgroundColor: '#BBB',
    },

    customImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        alignSelf: 'stretch',
        width: undefined,
        height: undefined,
    },
});

async function saveShotToCameraRoll(shotUri) {
    const [_, err] = await to(CameraRoll.saveToCameraRoll(shotUri, 'photo'));
    if (err) {
        console.log(`Camera Roll error: ${err}`);
        Alert.alert('Something happened, cannot save to camera roll.');
    }
}

class KeepImageSlider extends React.Component {
    resetCamera = () => {
        this.props.toggleCamera();
        this.props.resetShots();
    }

    cancelShots = () => {
        alerts.areYouSure(
            'If you continue the whole session will be lost.',
            this.resetCamera)
    }

    keepShots = (keepAll) => {
        let selectedShots = this.props.shotsUris.filter(({ _, keep }) => keep),
            saveShot = async ({ shotUri, _ }) => {
                saveShotToCameraRoll(shotUri);
            };

        if (keepAll) {
            alerts.areYouSure(
                'All photos will be saved.',
                () => { this.props.shotsUris.map(saveShot); this.resetCamera(); })
        }
        else if (!keepAll && selectedShots.length === 0) {
            alerts.areYouSure(
                'No photos were selected. If you continue the whole session will be lost.',
                this.resetCamera)
        }
        else {
            selectedShots.map(saveShot);
            this.resetCamera();
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageSlider
                    images={this.props.shotsUris}
                    customSlide={({ index, item, style, width }) => {
                        const { shotUri, keep } = item;
                        return (
                            // It's important to put style here because it's got offset inside
                            <View
                                key={index}
                                style={[style]}>
                                <ImageBackground
                                    source={{ uri: shotUri }}
                                    style={styles.customImage}
                                    resizeMode='contain'>
                                    <View style={styles.topSection}>
                                        <TouchableWithoutFeedback
                                            onPress={() => { this.props.keepShot(index) }}>
                                            <MaterialCommunityIcons
                                                name={`checkbox-${keep ? 'marked' : 'blank'}-circle-outline`}
                                                size={48}
                                                color='white' />
                                        </TouchableWithoutFeedback>
                                    </View>
                                </ImageBackground>
                            </View>
                        )
                    }}
                    customButtons={(position, move) => (
                        <View style={[styles.bottomSection]}>
                            <View style={styles.saveToolbar}>
                                <TouchableOpacity
                                    style={[styles.saveButtons]}
                                    onPress={this.keepShots.bind(this, false)}>
                                    <MaterialCommunityIcons
                                        name={`content-save`}
                                        size={40}
                                        color='white' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.saveButtons]}
                                    onPress={this.keepShots.bind(this, true)}>
                                    <MaterialCommunityIcons
                                        name={`content-save-all`}
                                        size={40}
                                        color='white' />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.saveButtons]}
                                    onPress={this.cancelShots}>
                                    <MaterialCommunityIcons
                                        name={`cancel`}
                                        size={40}
                                        color='white' />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.pagesToolbar}>
                                {
                                    this.props.shotsUris.map((item, index) => {
                                        return (
                                            <TouchableHighlight
                                                key={index}
                                                onPress={() => move(index)}
                                                style={[styles.pageButtons, position === index && styles.pageButtonSelected]}
                                                underlayColor="#CCC">
                                                <Text style={[styles.pageButtonsText]}>
                                                    {index + 1}
                                                </Text>
                                            </TouchableHighlight>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    )} />
            </View>
        );
    }
}

export default class CameraRollScreen extends React.Component {
    render() {
        let { shotsUris } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                {
                    // TODO - improve this - show fetching photos inside the ImageSlider
                    // if there are no photos
                    shotsUris ?
                        <KeepImageSlider
                            shotsUris={shotsUris}
                            resetShots={this.props.resetShots}
                            toggleCamera={this.props.toggleCamera}
                            keepShot={this.props.keepShot}>
                        </KeepImageSlider> :
                        <Text>Fetching photos...</Text>
                }
            </View>
        );
    }
}
