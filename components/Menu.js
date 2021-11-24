import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const TravellerButton = (props) => {
    const navigation = useNavigation();
    return (
        <Pressable
            onPress={() => navigation.navigate(props.dest)}
            style={({ pressed }) => [
                {
                    backgroundColor: pressed
                        ? 'wheat'
                        : 'white'
                },
                styles.button
            ]}>
            <Text style={styles.buttonText}> {props.children} </Text>
        </Pressable>
    );
}

export default Menu = ({ navigation }) => {
    return (
        <View style={styles.menu}>
            <TravellerButton dest="game5">Play - 5x5</TravellerButton>
            <TravellerButton dest="game6">Play - 6x6</TravellerButton>
            <TravellerButton dest="game7">Play - 7x7</TravellerButton>
        </View>
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
        fontSize: 30,
        textAlign: 'center'
    },
    menu: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
});
