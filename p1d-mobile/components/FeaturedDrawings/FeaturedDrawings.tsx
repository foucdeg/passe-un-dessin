import React, { useCallback, useEffect, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { Image, StyleSheet, View, Text } from 'react-native';
import { NoProps } from '../../utils/types';
import client from '../../utils/network-client';
import { PadStep } from '../../types';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  drawing: {
    width: 192,
    height: 192,
    borderRadius: 16,
  },
  caption: {
    position: 'absolute',
    top: 70,
    left: 150,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sentence: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_700Bold',
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    fontFamily: 'RobotoCondensed_400Regular',
  },
});

const FeaturedDrawings: React.FC<NoProps> = () => {
  const [steps, setSteps] = useState<PadStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [, doFetch] = useAsyncFn(async () => {
    const fetchedSteps = await client.get('/featured-pad-steps');
    setSteps(fetchedSteps);
  });

  const chooseNextPadStep = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % steps.length);
  }, [currentIndex, steps.length]);

  useEffect(() => {
    const timeout = setTimeout(chooseNextPadStep, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, [chooseNextPadStep]);

  useEffect(() => {
    doFetch();
  }, [doFetch]);

  if (!steps.length) return null;
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: step.drawing_url }} style={styles.drawing} />
      <View style={styles.caption}>
        <Text style={styles.sentence}>{step.sentence}</Text>
        <Text style={styles.author}>par {step.player.name}</Text>
      </View>
    </View>
  );
};

export default FeaturedDrawings;
