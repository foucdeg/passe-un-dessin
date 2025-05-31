import React from 'react';
import { NativeRouter, Route } from 'react-router-native';
/* eslint-disable camelcase */
import { Raleway_900Black } from '@expo-google-fonts/raleway';
import {
  RobotoCondensed_300Light,
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';
/* eslint-enable camelcase */
import { useFonts } from 'expo-font';

import { Text } from 'react-native';
import { NoProps } from './utils/types';
import Home from './Home';
import Leaderboard from './Leaderboard';
import Root from './Root';

export type RootStackParamList = {
  Home: undefined;
  Leaderboard: undefined;
};

const App: React.FC<NoProps> = () => {
  const [fontsLoaded] = useFonts({
    Raleway_900Black,
    RobotoCondensed_300Light,
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <Root>
        <Text>Loading</Text>
      </Root>
    );
  }

  return (
    <Root>
      <NativeRouter>
        <Route exact path="/" component={Home} />
        <Route path="/leaderboard" component={Leaderboard} />
      </NativeRouter>
    </Root>
  );
};

export default App;
