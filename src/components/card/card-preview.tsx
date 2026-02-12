import React from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity } from 'react-native';
import { BusinessCard } from '../../types/card';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

interface CardPreviewProps {
  card: BusinessCard | null;
  onClose: () => void;
  onSave: () => void;
  visible: boolean;
}

export const CardPreview = ({ card, onClose, onSave, visible }: CardPreviewProps) => {
  if (!card) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent} safeArea={false}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Card Preview</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            {card.profileImage ? (
              <Image source={{ uri: card.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.placeholder]}>
                <ThemedText style={styles.initials}>
                  {card.fullName.charAt(0).toUpperCase()}
                </ThemedText>
              </View>
            )}
            
            <ThemedText type="title" style={styles.name}>{card.fullName}</ThemedText>
            <ThemedText style={styles.title}>{card.jobTitle}</ThemedText>
            <ThemedText style={styles.company}>{card.company}</ThemedText>
            
            <View style={styles.details}>
              {card.phone && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Phone:</ThemedText>
                  <ThemedText>{card.phone}</ThemedText>
                </View>
              )}
              {card.email && (
                <View style={styles.detailRow}>
                  <ThemedText style={styles.label}>Email:</ThemedText>
                  <ThemedText>{card.email}</ThemedText>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <ThemedText style={styles.saveButtonText}>Save to Wallet</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    opacity: 0.5,
  },
  cardInfo: {
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  placeholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  company: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  details: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: 60,
    fontWeight: '600',
    opacity: 0.6,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
