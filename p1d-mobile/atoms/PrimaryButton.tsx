import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '51px',
    padding: '16px 32px',
    fontFamily: 'RobotoCondensed-Bold',
    background: 'linear-gradient(90deg, #ff9314 0%, #ff0080 100%)',
    fontSize: '16px',
  },
});

const PrimaryButton: React.FC<TouchableOpacityProps> = (props) => (
  <TouchableOpacity style={styles.container} {...props} />
);

export default PrimaryButton;
