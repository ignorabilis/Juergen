import { Alert } from 'react-native';

export function areYouSure(msg, okHandler, cancelHandler) {
    Alert.alert(
        'Are you sure?',
        msg,
        [
            { text: 'Cancel', onPress: cancelHandler },
            { text: 'OK', onPress: okHandler }
        ],
        { cancelable: false }
    )
}
