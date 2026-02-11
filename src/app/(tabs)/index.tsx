import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useStorage } from '@/hooks/use-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile, isLoading } = useStorage();

  useEffect(() => {
    if (!isLoading && !userProfile) {
      // Small delay to prevent flashing if needed, 
      // but usually we can just show the "Create" button
    }
  }, [userProfile, isLoading]);

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!userProfile) {
    return (
      <ThemedView style={styles.container} safeArea>
        <View style={styles.welcomeContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <ThemedText style={styles.subtitle}>
            You haven&apos;t created your digital business card yet.
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/card/create')}
          >
            <ThemedText style={styles.buttonText}>Create My Card</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safeArea>
      <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            {userProfile.profileImage ? (
              <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.imagePlaceholder]}>
                <ThemedText style={styles.initials}>
                  {userProfile.fullName.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
            )}
            <View style={styles.headerText}>
              <ThemedText type="subtitle">{userProfile.fullName}</ThemedText>
              <ThemedText>{userProfile.jobTitle}</ThemedText>
              <ThemedText style={styles.companyText}>{userProfile.company}</ThemedText>
            </View>
          </View>

          <View style={styles.cardBody}>
            {userProfile.phone && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Phone:</ThemedText>
                <ThemedText>{userProfile.phone}</ThemedText>
              </View>
            )}
            {userProfile.email && (
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                <ThemedText>{userProfile.email}</ThemedText>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/card/${userProfile.id}`)}
          >
            <ThemedText style={styles.editButtonText}>Edit Card</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
         <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#34C759' }]}
          onPress={() => router.push('/(tabs)/share')}
        >
          <ThemedText style={styles.buttonText}>Share My Card</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#5856D6' }]}
          onPress={() => router.push('/(tabs)/scan')}
        >
          <ThemedText style={styles.buttonText}>Scan a Card</ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    opacity: 0.7,
  },
  cardContainer: {
    padding: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imagePlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerText: {
    marginLeft: 15,
    flex: 1,
  },
  companyText: {
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 2,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 60,
    fontWeight: '600',
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10,
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  actionsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  }
});