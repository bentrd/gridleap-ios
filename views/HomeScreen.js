import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Menu from '../components/Menu';
import { AdMobBanner } from "expo-ads-admob";
import { RFPercentage } from "react-native-responsive-fontsize";
import Spacer from '../components/Spacer';

export const Ad = (props) => {
    return (
        <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID={props.id}
            servePersonalizedAds='true'
            style={{ position: 'absolute', bottom: RFPercentage(3) }}
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
            <Spacer size={13} />
            <Menu />
            <Ad id='ca-app-pub-5015586611437235/7838694129' />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#242424'
    },
    title: {
        fontFamily: 'Questrial',
        fontSize: RFPercentage(10),
        color: 'wheat',
        textAlign: 'center',
        transform: [{ translateY: 20 }]
    }
});
