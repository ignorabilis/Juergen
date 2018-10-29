import React from 'react';
import { Animated, Easing, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CameraText from '../components/CameraText';

import * as math from '../../utils/math'

const randLoadingHeaders = ['Here they come!',
    'Excited?',
    'Some magic coming!',
    'Cool!',
    'Got them. What\'s next?'];

export default class Loader extends React.Component {
    spinValue = new Animated.Value(0);
    spin = this.spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    componentDidMount() {
        Animated.loop(
            Animated.timing(
                this.spinValue,
                {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start()
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.View style={{
                    width: 48,
                    height: 48,
                    transform: [{ rotate: this.spin }]
                }}>
                    <MaterialCommunityIcons
                        name={`loading`}
                        size={48}
                        color='white' />
                </Animated.View>
                <CameraText>{randLoadingHeaders[math.randInt(0, randLoadingHeaders.length - 1)]}</CameraText>
            </View>
        );
    }
}
