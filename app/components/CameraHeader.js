import React from 'react';
import { Text } from 'react-native';

import CameraText from './CameraText';

export default class CameraHeader extends React.Component {
    render() {
        return (
            <CameraText>
                <Text style={{ fontSize: 38 }}>
                    {this.props.children}
                </Text>
            </CameraText>
        );
    }
}
