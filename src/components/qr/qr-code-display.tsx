import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { BusinessCard } from '../../types/card';
import { ThemedText } from '../themed-text';

interface QrCodeDisplayProps {
  card: BusinessCard;
  size?: number;
}

export const QrCodeDisplay = ({ card, size = 200 }: QrCodeDisplayProps) => {
  // Exclude profileImage from QR data to prevent RangeError and keep QR scanable
  const { profileImage, ...cardWithoutImage } = card;
  const data = JSON.stringify(cardWithoutImage);

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={data}
          size={size}
          color="black"
          backgroundColor="white"
        />
      </View>
      <ThemedText style={styles.hint}>
        Scan this QR code to receive my card
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hint: {
    marginTop: 15,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
