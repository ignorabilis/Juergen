import { AsyncStorage } from 'react-native';

export async function setItem(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Basic logs for now
        console.log('Could not set item to AsyncStorage.')
    }
}

export async function getItem(key) {
    try {
        const value = JSON.parse(await AsyncStorage.getItem(key));
        return value;
    } catch (error) {
        // Basic logs for now
        console.log('Could not get item from AsyncStorage.')
    }
}
