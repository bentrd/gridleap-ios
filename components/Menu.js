import * as React from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Player from '../Player';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}

export const TravellerButton = (props) => {
    const navigation = useNavigation();
    const handleClick = () => {
        Player.playSound('click');
        navigation.navigate(props.dest);
    }
    return (
        <Pressable
            onPress={() => handleClick()}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed
                        ? 'wheat'
                        : 'white'
                },
                styles.button
            ]}>
            <Text style={styles.buttonText}>{props.children}</Text>
        </Pressable>
    );
}

export default Menu = ({ navigation }) => {
    const [showSettings, setShowSettings] = React.useState(false);
    const [volume, setVolume] = React.useState();
    const handleClick = () => setShowSettings(true);
    var sliderTimeoutId;

    const getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) setVolume(value);
            else setVolume('0.5');
        } catch (e) {
            // error reading value
        }
    }

    React.useEffect(() => {
        getData('@volume')
    }, []);

    const Settings = () => {
        const onValueChange = value => {
            clearTimeout(sliderTimeoutId)
            sliderTimeoutId = setTimeout(() => {
                setVolume(String(value.toFixed(2)));
                storeData('@volume', String(value.toFixed(2)));
                Player.playSound('pop');
            }, 150)
        }
        if (showSettings) {
            return (
                <View style={styles.popupwrap}>
                    <View style={styles.popup}>
                        <Pressable onPress={() => {
                            Player.playSound('click');
                            setShowSettings(false);
                        }} style={{ alignSelf: 'flex-end', padding: 0, margin: 0 }}>
                            <Icon name='x' type='feather' />
                        </Pressable>
                        <Text style={styles.popuptitle}>Settings</Text>
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Icon name='volume-2' type='feather' size={RFPercentage(5)} style={{ flexGrow: 2, marginEnd: RFPercentage(2) }} />
                            <Slider
                                style={{ width: 200, height: 40 }}
                                minimumValue={0}
                                maximumValue={0.2}
                                minimumTrackTintColor="#242424"
                                maximumTrackTintColor="wheat"
                                value={Number(volume)}
                                onValueChange={value => onValueChange(value)}
                                style={{ flexGrow: 5 }}
                            />
                        </View>
                    </View>
                </View>
            )
        }
        else return <></>
    }

    return (
        <>
            <View style={styles.menu}>
                <TravellerButton dest="game5">Play - 5x5</TravellerButton>
                <TravellerButton dest="game6">Play - 6x6</TravellerButton>
                <TravellerButton dest="game7">Play - 7x7</TravellerButton>
                <View><Text>&nbsp;</Text></View>
                <View><Text>&nbsp;</Text></View>
                <View><Text>&nbsp;</Text></View>
                <View><Text>&nbsp;</Text></View>
                <Pressable style={({ pressed }) => [
                    {
                        backgroundColor: pressed
                            ? 'wheat'
                            : 'white'
                    },
                    styles.button
                ]} onPress={handleClick}>
                    <Text style={styles.buttonText}>Settings</Text>
                </Pressable>
            </View>
            <Settings show={showSettings} />
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        margin: 20,
        padding: 15,
        shadowColor: '#bbb',
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 0,
        shadowOpacity: 1
    },
    buttonText: {
        fontFamily: 'Questrial',
        fontSize: RFPercentage(5),
        textAlign: 'center'
    },
    menu: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    popupwrap: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000066',
    },
    popup: {
        width: 0.7 * Dimensions.get('window').width,
        maxWidth: 500,
        backgroundColor: 'white',
        borderRadius: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10
    },
    popuptitle: {
        fontSize: 40,
        fontFamily: 'Questrial',
        transform: [{ translateY: -20 }]
    }
});
