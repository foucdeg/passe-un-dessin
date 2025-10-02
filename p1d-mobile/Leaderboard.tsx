import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import { NoProps } from './utils/types';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

const Leaderboard: React.FC<NoProps> = () => (
  <View style={styles.container}>
    <Text>Leaderboard</Text>
    <Link to="/">
      <Text>Back to home</Text>
    </Link>
  </View>
);

export default Leaderboard;
