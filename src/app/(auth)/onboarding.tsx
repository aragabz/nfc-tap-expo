import React, { useRef, useState } from 'react';
import { StyleSheet, FlatList, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScreen, OnboardingData } from '../../components/onboarding/onboarding-screen';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { useOnboarding } from '../../hooks/use-onboarding';

const ONBOARDING_DATA: OnboardingData[] = [
  {
    id: '1',
    title: 'Welcome to NFC Tap',
    description: 'The easiest way to share and scan business cards using NFC and QR codes.',
    icon: 'house.fill',
  },
  {
    id: '2',
    title: 'Scan Effortlessly',
    description: 'Just tap an NFC tag or scan a QR code to instantly save contacts to your wallet.',
    icon: 'qrcode.viewfinder',
  },
  {
    id: '3',
    title: 'Share with a Tap',
    description: 'Create your own digital card and share it instantly with others.',
    icon: 'square.and.arrow.up',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<FlatList>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useOnboarding();

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      scrollRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <ThemedView style={styles.container} safeArea>
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={handleSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
      >
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </TouchableOpacity>

      <FlatList
        ref={scrollRef}
        data={ONBOARDING_DATA}
        renderItem={({ item }) => <OnboardingScreen item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next screen'}
        >
          <ThemedText style={styles.nextButtonText}>
            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 20,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
