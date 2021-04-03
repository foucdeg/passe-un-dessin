import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import background from './assets/background.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

interface Props {
  children: React.ReactNode;
}

const Root: React.FC<Props> = ({ children }) => (
  <View style={styles.container}>
    <ImageBackground source={background} style={styles.image}>
      {children}
    </ImageBackground>
  </View>
);

export default Root;
