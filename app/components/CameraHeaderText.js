import React from 'react';
import { Text } from 'react-native';

import CameraText from './CameraText';

export default class CameraHeaderText extends React.Component {
    render() {
        return (
            <CameraText
                style={{
                    ...this.props.style,
                }}>
                <Text
                    style={{ fontSize: 38 }}>
                    {this.props.children}
                </Text>
            </CameraText>
        );
    }
}
