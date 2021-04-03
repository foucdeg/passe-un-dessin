import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import FeaturedDrawings from './components/FeaturedDrawings';
import { NoProps } from './utils/types';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-evenly' },
  title: {
    fontFamily: 'Raleway_900Black',
    fontSize: 32,
    color: '#9B37A9',
    textTransform: 'uppercase',
  },
});

const Home: React.FC<NoProps> = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Passe un Dessin</Text>
    <FeaturedDrawings />
    <Link to="/leaderboard">
      <Text>Go to Leaderboard</Text>
    </Link>
  </View>
);

export default Home;
