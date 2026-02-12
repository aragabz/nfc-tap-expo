import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { LoadingOverlay } from "../../components/ui/loading-overlay";
import { useAuth } from "../../hooks/use-auth";

export default function Login() {
  const { signIn, isLoading } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Sign In Error",
        "Failed to sign in with Microsoft. Please check your network and try again.",
      );
    }
  };

  const handleTestBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync("https://google.com");
    } catch (error) {
      console.error("Browser test error:", error);
      Alert.alert(
        "Browser Error",
        "Failed to open google.com. This suggests a general browser issue on this device.",
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="house.fill" size={80} color="#007AFF" />
        <ThemedText type="title" style={styles.title}>
          NFC Tap
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to manage your digital business cards
        </ThemedText>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.microsoftButton}
          onPress={handleSignIn}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Sign in with Microsoft"
        >
          <ThemedText style={styles.microsoftButtonText}>
            {isLoading ? "Signing in..." : "Sign in with Microsoft"}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={handleTestBrowser}>
          <ThemedText style={styles.testButtonText}>
            Test Browser Connectivity
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.footerText}>
          By signing in, you agree to our Terms and Privacy Policy.
        </ThemedText>
      </View>

      {isLoading && <LoadingOverlay message="Connecting to Microsoft..." />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    marginTop: 20,
    fontSize: 32,
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    opacity: 0.7,
    fontSize: 16,
  },
  content: {
    alignItems: "center",
  },
  microsoftButton: {
    backgroundColor: "#2F2F2F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  microsoftButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  testButton: {
    padding: 10,
    marginBottom: 20,
  },
  testButtonText: {
    color: "#007AFF",
    fontSize: 14,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.5,
    paddingHorizontal: 40,
  },
});
