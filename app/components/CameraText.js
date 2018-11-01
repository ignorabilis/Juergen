import React from 'react';
import { Text } from 'react-native';

export default class CameraText extends React.Component {
    render() {
        return (
            <Text style={{
                ...this.props.style,
                color: 'white',
                fontSize: 20
            }}>
                {this.props.children}
            </Text>
        );
    }
}
