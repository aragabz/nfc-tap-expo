import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { ThemedView } from '../themed-view';
import { ThemedText } from '../themed-text';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" />
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});
