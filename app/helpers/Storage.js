import { AsyncStorage } from 'react-native';

// It is ok for now to just ignore any errors here - 
// default values are provided for the app if 
// getItem/setItem do not work properly
export async function setItem(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Could not set item to AsyncStorage.')
    }
}

export async function getItem(key) {
    try {
        const value = JSON.parse(await AsyncStorage.getItem(key));
        return value;
    } catch (error) {
        console.warn('Could not get item from AsyncStorage.')
    }
}
