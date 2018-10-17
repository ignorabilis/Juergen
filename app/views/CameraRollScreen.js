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
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    Alert
} from 'react-native';
import ImageSlider from 'react-native-image-slider'

import { shotsToTake } from '../config'

console.disableYellowBox = true;

const styles = StyleSheet.create({
    contentText: { color: '#fff' },
    topToolbar: {
        
    },
    bottomToolbar: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    buttons: {
    },
    buttonsText: {
        fontSize: 14,
        color: 'white',
    },
    button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSelected: {
        opacity: 1,
        color: '#CCC',
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

class KeepImageSlider extends React.Component {
    render() {
        const { height: deviceHeight } = Dimensions.get('window');

        return (
            <View style={{ flex: 1 }}>
                <ImageSlider
                    images={this.props.photoUrls}
                    customSlide={({ index, item, style, width }) => (
                        // It's important to put style here because it's got offset inside
                        <View
                            key={index}
                            style={[
                                style,
                                styles.customSlide,
                            ]}>
                            <ImageBackground source={{ uri: item }} style={styles.customImage}>
                                {/* Any content here */}
                            </ImageBackground>
                        </View>
                    )}
                    customButtons={(position, move) => (
                        <View style={[{
                            height: deviceHeight,
                            marginTop: -deviceHeight,
                            borderColor: 'red',
                            borderWidth: 2
                        }, styles.buttons]}>
                            <View style={{flex: 1}}>
                                <Text>
                                    MORE
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                {
                                    this.props.photoUrls.map((image, index) => {
                                        return (
                                            <TouchableHighlight
                                                key={index}
                                                underlayColor="#ccc"
                                                onPress={() => move(index)}
                                                style={styles.button}>
                                                <Text style={[styles.buttonsText, position === index && styles.buttonSelected]}>
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
    state = { photoUrls: null };

    async componentDidMount() {
        let photos = await CameraRoll.getPhotos({ first: shotsToTake }),
            photoUrls = photos.edges.map(({ node: photo }) => {
                return photo.image.uri;
            });
        this.setState({ photoUrls });
    }

    render() {
        let { photoUrls } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                {
                    photoUrls ?
                        <KeepImageSlider
                            photoUrls={photoUrls}></KeepImageSlider> :
                        <Text>Fetching photos...</Text>
                }
            </View>
        );
    }
}
