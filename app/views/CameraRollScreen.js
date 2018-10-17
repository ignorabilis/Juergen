import React from 'react';
import {
    CameraRoll,
    Image,
    Text,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert
} from 'react-native';

import { shotsToTake } from '../config'

const { width } = Dimensions.get('window')
const photoTilePadding = 1;

class PhotoTile extends React.Component {
    render() {
        let { photo } = this.props;

        return (
            <View
                style={{
                    width: width / 4,
                    height: width / 4,
                    paddingTop: 2,
                    paddingHorizontal: 2
                }}>
                <Image
                    source={photo.image}
                    style={{
                        flex: 1,
                        alignSelf: 'stretch',
                        width: undefined,
                        height: undefined
                    }}
                    resizeMode='cover'>
                </Image>
            </View>
        );
    }
}

class Photos extends React.Component {
    render() {
        return this.props.photos.edges.map(({ node: photo }) => {
            return (
                <PhotoTile
                    key={photo.image.uri}
                    photo={photo}>
                </PhotoTile>
            );
        })
    }
}

export default class CameraRollScreen extends React.Component {
    state = { photos: null };

    async componentDidMount() {
        let photos = await CameraRoll.getPhotos({ first: shotsToTake });
        this.setState({ photos });
    }

    render() {
        let { photos } = this.state;
        return (
            <ScrollView
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}
                style={{
                    flex: 1,
                }}>
                {
                    photos ?
                        <Photos photos={this.state.photos}></Photos> :
                        <Text>Fetching photos...</Text>
                }
            </ScrollView>
        );
    }
}
