import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { IconSymbol } from '../ui/icon-symbol';

export interface OnboardingData {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface OnboardingScreenProps {
  item: OnboardingData;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <ThemedView style={[styles.container, { width }]}>
      <View style={styles.iconContainer}>
        <IconSymbol name={item.icon as any} size={120} color="#007AFF" />
      </View>
      <View style={styles.textContainer}>
        <ThemedText type="title" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.description}>
          {item.description}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    opacity: 0.8,
  },
});
