import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useStorage } from '@/hooks/use-storage';
import { ScannedCard } from '@/types/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CardPreview } from '@/components/card/card-preview';
import * as Contacts from 'expo-contacts';

export default function WalletScreen() {
  const { scannedCards, removeScannedCard, isLoading } = useStorage();
  const [selectedCard, setSelectedCard] = useState<ScannedCard | null>(null);

  const handleExport = async (card: ScannedCard) => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        await Contacts.addContactAsync({
          [Contacts.Fields.FirstName]: card.fullName.split(' ')[0],
          [Contacts.Fields.LastName]: card.fullName.split(' ').slice(1).join(' '),
          [Contacts.Fields.JobTitle]: card.jobTitle || '',
          [Contacts.Fields.Company]: card.company || '',
          [Contacts.Fields.Emails]: card.email ? [{ label: 'work', email: card.email }] : [],
          [Contacts.Fields.PhoneNumbers]: card.phone ? [{ label: 'work', number: card.phone }] : [],
          contactType: Contacts.ContactTypes.Person,
          name: card.fullName,
        });
        Alert.alert('Success', 'Contact added to your phone book!');
      } catch (error) {
        Alert.alert('Error', 'Failed to add contact.');
      }
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
    }
  };

  const renderItem = ({ item }: { item: ScannedCard }) => (
    <TouchableOpacity 
      style={styles.cardItem}
      onPress={() => setSelectedCard(item)}
    >
      <View style={styles.cardContent}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]}>
            <ThemedText style={styles.initials}>
              {item.fullName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        )}
        <View style={styles.cardText}>
          <ThemedText type="defaultSemiBold">{item.fullName}</ThemedText>
          <ThemedText style={styles.subtitle}>{item.jobTitle} @ {item.company}</ThemedText>
          <ThemedText style={styles.date}>
            Scanned on {new Date(item.scannedAt).toLocaleDateString()}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => handleExport(item)}
        >
          <ThemedText style={styles.actionText}>Export</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => {
            Alert.alert(
              'Delete Card',
              'Are you sure you want to delete this card?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => removeScannedCard(item.id) },
              ]
            );
          }}
        >
          <ThemedText style={styles.deleteText}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={scannedCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No scanned cards yet.</ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      
      <CardPreview 
        card={selectedCard}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onSave={() => setSelectedCard(null)} // Already saved
      />
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
  listContent: {
    padding: 20,
  },
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardText: {
    marginLeft: 15,
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  date: {
    fontSize: 12,
    opacity: 0.4,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionBtn: {
    marginLeft: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteBtn: {
    //
  },
  deleteText: {
    color: '#FF3B30',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    opacity: 0.5,
  },
});