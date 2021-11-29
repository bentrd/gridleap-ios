import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default Spacer = props => {
    return (
        <View style={{ height: `${props.size}%` }}></View>
    );
}