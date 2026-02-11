import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { CardForm } from '../../components/card/card-form';
import { useStorage } from '../../hooks/use-storage';
import { ThemedView } from '../../components/themed-view';
import { BusinessCard } from '../../types/card';

export default function Create() {
  const router = useRouter();
  const { saveProfile, isLoading } = useStorage();

  const handleCreate = async (data: Partial<BusinessCard>) => {
    try {
      const newCard: BusinessCard = {
        id: Crypto.randomUUID(),
        fullName: data.fullName!,
        jobTitle: data.jobTitle,
        company: data.company,
        phone: data.phone,
        email: data.email,
        profileImage: data.profileImage,
        version: '1.0',
      };

      await saveProfile(newCard);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <CardForm onSubmit={handleCreate} isLoading={isLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
