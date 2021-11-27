import { Audio } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage';

const soundObjects = {}

class Player {

    static load(library) {
        const promisedSoundObjects = []

        for (const name in library) {
            const sound = library[name]

            soundObjects[name] = new Audio.Sound()

            promisedSoundObjects.push(
                soundObjects[name].loadAsync(sound)
            )
        }

        return promisedSoundObjects
    }

    static async playSound(name) {
        try {
            if (soundObjects[name]) {
                const value = await AsyncStorage.getItem('@volume');
                if (value == null) value = '0.5';
                await soundObjects[name].setVolumeAsync(Number(value));
                await soundObjects[name].replayAsync();
            }
        } catch (error) {
            console.warn(error)
        }
    }
}

export default Player