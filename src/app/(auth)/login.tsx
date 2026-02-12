import Icons from "@/assets/icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Icons.TasamaLogoSVG
          style={{
            paddingTop: 40,
          }}
        />
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
    backgroundColor: "#0B2B70",
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  subtitle: {
    marginTop: 20,
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
    fontWeight: "500",
  },
  content: {
    alignItems: "center",
  },
  microsoftButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  microsoftButtonText: {
    color: "#0B2B70",
    fontSize: 17,
    fontWeight: "700",
  },
  testButton: {
    padding: 10,
    marginBottom: 20,
  },
  testButtonText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    paddingHorizontal: 40,
  },
});
