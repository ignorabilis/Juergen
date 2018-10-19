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

import to from '../../utils/to';

const styles = StyleSheet.create({
    contentText: { color: '#fff' },
    topToolbar: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    selectionButton: {
        margin: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginRight: 5,
    },
    selectionButtonText: {
        fontSize: 18,
        color: 'white',
    },
    bottomToolbar: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    buttons: {
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

class KeepImageSlider extends React.Component {
    keepAll = () => {
        this.props.shotsUris.map(async (shotUri) => {
            const [_, err] = await to(CameraRoll.saveToCameraRoll(shotUri, 'photo'));
            if (err) {
                console.log(`Camera Roll error: ${err}`);
                Alert.alert('Something happened, cannot save to camera roll.');
            }
        })

        this.props.resetShots();
    };

    render() {
        console.log('uris: ' + this.props.shotsUris);
        return (
            <View style={{ flex: 1 }}>
                <ImageSlider
                    images={this.props.shotsUris}
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
                            height: 130,
                            marginTop: -130,
                            borderColor: 'red',
                            borderWidth: 2
                        }, styles.buttons]}>
                            <View style={styles.topToolbar}>

                                <TouchableHighlight
                                    style={[styles.selectionButton]}
                                    underlayColor="#CCC">
                                    <Text style={[styles.selectionButtonText]}>
                                        Keep
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={[styles.selectionButton]}
                                    underlayColor="#CCC"
                                    onPress={this.keepAll}>
                                    <Text style={[styles.selectionButtonText]}>
                                        Keep All
                                    </Text>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    style={[styles.selectionButton]}
                                    underlayColor="#CCC"
                                    onPress={this.props.resetShots}>
                                    <Text style={[styles.selectionButtonText]}>
                                        Done
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.bottomToolbar}>
                                {
                                    this.props.shotsUris.map((image, index) => {
                                        console.log(image);
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
    async componentDidMount() {
        // Get the images from the memory of the phone, as they come; 
        // let photos = await CameraRoll.getPhotos({ first: shotsToTake }),
        //     photoUrls = photos.edges.map(({ node: photo }) => {
        //         return photo.image.uri;
        //     });
    }

    render() {
        let { shotsUris } = this.props;
        console.log('uot', shotsUris);
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden={true} />
                {
                    shotsUris ?
                        <KeepImageSlider
                            shotsUris={shotsUris}
                            resetShots={this.props.resetShots}></KeepImageSlider> :
                        <Text>Fetching photos...</Text>
                }
            </View>
        );
    }
}
