import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CardForm } from '@/components/card/card-form';
import { useStorage } from '@/hooks/use-storage';
import { ThemedView } from '@/components/themed-view';
import { BusinessCard } from '@/types/card';

export default function EditCardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { userProfile, saveProfile, isLoading } = useStorage();

  const handleUpdate = async (data: Partial<BusinessCard>) => {
    try {
      if (!userProfile) return;

      const updatedCard: BusinessCard = {
        ...userProfile,
        ...data,
        id: id as string,
      };

      await saveProfile(updatedCard);
      router.back();
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <CardForm 
        initialData={userProfile} 
        onSubmit={handleUpdate} 
        isLoading={isLoading} 
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
