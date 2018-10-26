import React from 'react';
import {
    StatusBar,
    CameraRoll,
    Image,
    ImageBackground,
    Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Dimensions,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ImageSlider from 'react-native-image-slider';

import to from '../../utils/to';

const styles = StyleSheet.create({
    contentText: { color: '#fff' },
    saveToolbar: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    saveButton: {
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    pagesToolbar: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    topSection: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    bottomSection: {
        height: 150,
        marginTop: -150,
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    buttonsText: {
        fontSize: 14,
        color: 'black',
    },
    imageButton: {
        margin: 3,
        width: 20,
        height: 20,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'white',
        marginRight: 5,
        borderRadius: 10
    },
    buttonSelected: {
        opacity: 1,
        backgroundColor: '#CCC',
    },
    customSlide: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    customImage: {
        flex: 1,
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
    keepShots = (keepAll) => {
        this.props.shotsUris.map(async ({ shotUri, keep }) => {
            if (keepAll || keep) {
                saveShotToCameraRoll(shotUri);
            }
        });

        this.props.toggleCamera();
        this.props.resetShots();
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
                                style={[
                                    style,
                                    styles.customSlide,
                                ]}>
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
                                <TouchableHighlight
                                    style={[styles.saveButton]}
                                    underlayColor="#CCC"
                                    onPress={this.keepShots.bind(this, false)}>
                                    <MaterialCommunityIcons
                                        name={`content-save`}
                                        size={40}
                                        color='white' />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={[styles.saveButton]}
                                    underlayColor="#CCC"
                                    onPress={this.keepShots.bind(this, true)}>
                                    <MaterialCommunityIcons
                                        name={`content-save-all`}
                                        size={40}
                                        color='white' />
                                </TouchableHighlight>
                            </View>
                            <View style={styles.pagesToolbar}>
                                {
                                    this.props.shotsUris.map((item, index) => {
                                        return (
                                            <TouchableHighlight
                                                key={index}
                                                onPress={() => move(index)}
                                                style={[styles.imageButton, position === index && styles.buttonSelected]}
                                                underlayColor="#CCC">
                                                <Text style={[styles.buttonsText]}>
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
