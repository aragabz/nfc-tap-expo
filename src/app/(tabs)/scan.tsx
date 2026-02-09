import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useStorage } from '@/hooks/use-storage';
import { useNfc } from '@/hooks/use-nfc';
import { NfcScanResultType } from '@/services/nfc';
import { QrScanner } from '@/components/qr/qr-scanner';
import { CardPreview } from '@/components/card/card-preview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BusinessCard, ScannedCard } from '@/types/card';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const router = useRouter();
  const { addScannedCard } = useStorage();
  const { 
    isNfcSupported, 
    isNfcEnabled, 
    isSessionActive, 
    checkAvailability, 
    readCard, 
    stopSession 
  } = useNfc();

  const [scannedData, setScannedData] = useState<BusinessCard | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [activeMode, setActiveMode] = useState<'NFC' | 'QR' | null>(null);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleNfcRead = async () => {
    setActiveMode('NFC');
    try {
      const outcome = await readCard();
      if (outcome.type === NfcScanResultType.SUCCESS && outcome.data) {
        setScannedData(outcome.data);
        setIsPreviewVisible(true);
      } else if (outcome.type !== NfcScanResultType.ERROR || outcome.error) {
        // Show alert for specific non-success types (Secure element, Empty tag, etc.)
        // or hardware errors that returned an error message
        Alert.alert('NFC Scan', outcome.error || 'Unexpected result during scan.');
      }
    } catch (error) {
      // Hardware level errors or cancellation handled in hook/service
    } finally {
      setActiveMode(null);
    }
  };

  const handleQrScan = (data: string) => {
    try {
      const card = JSON.parse(data) as BusinessCard;
      if (card.fullName && card.version) {
        setScannedData(card);
        setIsPreviewVisible(true);
      } else {
        throw new Error('Invalid card data');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code data');
    }
  };

  const handleSave = async () => {
    if (scannedData) {
      const scannedCard: ScannedCard = {
        ...scannedData,
        scannedAt: new Date().toISOString(),
      };
      await addScannedCard(scannedCard);
      setIsPreviewVisible(false);
      setScannedData(null);
      Alert.alert('Success', 'Card saved to wallet!');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Scan Business Card</ThemedText>
        
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, activeMode === 'QR' && styles.activeButton]}
            onPress={() => setActiveMode(activeMode === 'QR' ? null : 'QR')}
          >
            <ThemedText style={[styles.modeButtonText, activeMode === 'QR' && styles.activeText]}>
              QR Scanner
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modeButton, activeMode === 'NFC' && styles.activeButton]}
            onPress={activeMode === 'NFC' ? stopSession : handleNfcRead}
            disabled={!isNfcSupported || !isNfcEnabled}
          >
            <ThemedText style={[
              styles.modeButtonText, 
              activeMode === 'NFC' && styles.activeText,
              (!isNfcSupported || !isNfcEnabled) && styles.disabledText
            ]}>
              NFC Tap
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.viewer}>
          {activeMode === 'QR' ? (
            <QrScanner onScan={handleQrScan} isActive={activeMode === 'QR'} />
          ) : (
            <View style={styles.nfcPlaceholder}>
              {isSessionActive ? (
                <ThemedText style={styles.hint}>Ready to scan... Tap devices back-to-back.</ThemedText>
              ) : (
                <ThemedText style={styles.placeholderText}>
                  Select a mode above to start scanning.
                </ThemedText>
              )}
            </View>
          )}
        </View>
      </View>

      <CardPreview 
        card={scannedData}
        visible={isPreviewVisible}
        onClose={() => {
          setIsPreviewVisible(false);
          setScannedData(null);
        }}
        onSave={handleSave}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    marginBottom: 30,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonText: {
    fontWeight: '600',
    opacity: 0.6,
  },
  activeText: {
    color: '#007AFF',
    opacity: 1,
  },
  disabledText: {
    opacity: 0.2,
  },
  viewer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 20,
    borderStyle: 'dashed',
    width: '100%',
  },
  placeholderText: {
    textAlign: 'center',
    opacity: 0.4,
    padding: 40,
  },
  hint: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  }
});
