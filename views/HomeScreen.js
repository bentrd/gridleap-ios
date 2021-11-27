import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Menu from '../components/Menu';
import { AdMobBanner } from "expo-ads-admob";

export const Ad = (props) => {
    return (
        <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID={props.id}
            servePersonalizedAds='true'
        />
    );
}

export const Title = (props) => {
    return (
        <Text style={styles.title}>GridLeap</Text>
    );
}

export default HomeScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.main}>
            <Title />
            <Menu />
            <Ad id='ca-app-pub-5015586611437235/7838694129' />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#242424'
    },
    title: {
        fontFamily: 'Questrial',
        fontSize: 75,
        color: 'wheat',
        textAlign: 'center',
        transform: [{ translateY: 20 }]
    },
    credits: {
        fontFamily: 'Questrial',
        fontSize: 20,
        color: '#555'
    }
});
