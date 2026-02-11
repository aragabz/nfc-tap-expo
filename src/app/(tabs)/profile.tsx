import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/use-auth';
import { ProfileCard } from '@/components/profile/profile-card';
import Constants from 'expo-constants';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Profile</ThemedText>
        
        <ProfileCard user={user} />

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>App Information</ThemedText>
          <View style={styles.row}>
            <ThemedText>Version</ThemedText>
            <ThemedText style={styles.value}>{Constants.expoConfig?.version || '1.0.0'}</ThemedText>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 30,
  },
  section: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.05)',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  value: {
    opacity: 0.6,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
