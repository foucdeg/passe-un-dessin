import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  container: {
    height: 51,
    fontFamily: 'RobotoCondensed-Bold',
  },
  inside: {
    borderRadius: 28,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const PrimaryButton: React.FC<TouchableOpacityProps> = ({
  children,
  ...otherProps
}) => (
  <TouchableOpacity style={styles.container} {...otherProps}>
    <LinearGradient
      style={styles.inside}
      colors={['#ff9314', '#ff0080']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
    >
      <Text style={styles.text}>{children}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default PrimaryButton;
