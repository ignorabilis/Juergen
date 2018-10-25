import React from 'react';
import { View, Text } from 'react-native';

export default class Loader extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ color: 'white' }}>loading</Text>
            </View>
        );
    }
}
