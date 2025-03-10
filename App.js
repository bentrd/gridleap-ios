import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './views/HomeScreen';
import Game from './components/Game';
import * as Font from 'expo-font';
import Player from './Player';
import soundLibrary from './soundLibrary';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  loadAssets() {
    const sounds = Player.load(soundLibrary);
    return Promise.all([
      Font.loadAsync({
        Questrial: require('./assets/fonts/Questrial-Regular.ttf'),
        'Questrial': {
          uri: require('./assets/fonts/Questrial-Regular.ttf'),
          display: Font.FontDisplay.FALLBACK,
        },
      }),
      ...sounds
    ])
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.loadAssets}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }

    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="game5">{() => <Game size={5} />}</Stack.Screen>
          <Stack.Screen name="game6">{() => <Game size={6} />}</Stack.Screen>
          <Stack.Screen name="game7">{() => <Game size={7} />}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({

});
