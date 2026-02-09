import { QrCodeDisplay } from "@/components/qr/qr-code-display";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useNfc } from "@/hooks/use-nfc";
import { useStorage } from "@/hooks/use-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ShareScreen() {
  const router = useRouter();
  const { userProfile, isLoading } = useStorage();
  const {
    isNfcSupported,
    isNfcEnabled,
    isSessionActive,
    checkAvailability,
    writeCard,
    stopSession,
  } = useNfc();

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleStartNfc = async () => {
    if (!userProfile) return;

    try {
      await writeCard(userProfile);
      Alert.alert("Success", "Business card shared via NFC!");
    } catch (error) {
      // Error handled in hook
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!userProfile) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Please create a card first.</ThemedText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText style={styles.buttonText}>Go to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Share Your Card
        </ThemedText>

        <View style={styles.qrSection}>
          <QrCodeDisplay card={userProfile} />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <View style={styles.line} />
        </View>

        <View style={styles.nfcSection}>
          <ThemedText type="subtitle" style={styles.nfcTitle}>
            NFC Tap
          </ThemedText>
          {isNfcSupported ? (
            <>
              {isNfcEnabled ? (
                <TouchableOpacity
                  style={[
                    styles.nfcButton,
                    isSessionActive && styles.activeButton,
                  ]}
                  onPress={isSessionActive ? stopSession : handleStartNfc}
                >
                  <ThemedText style={styles.buttonText}>
                    {isSessionActive ? "Cancel NFC Tap" : "Start NFC Tap"}
                  </ThemedText>
                </TouchableOpacity>
              ) : (
                <ThemedText style={styles.errorText}>
                  NFC is disabled in settings.
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText style={styles.errorText}>
              NFC is not supported on this device.
            </ThemedText>
          )}
          {isSessionActive && (
            <ThemedText style={styles.hint}>
              Approach the other device/tag...
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  qrSection: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    marginHorizontal: 10,
    opacity: 0.5,
    fontWeight: "bold",
  },
  nfcSection: {
    alignItems: "center",
    width: "100%",
  },
  nfcTitle: {
    marginBottom: 15,
  },
  nfcButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FF3B30",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
  },
  hint: {
    marginTop: 15,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
  },
});
