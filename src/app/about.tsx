import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Tasama</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Digital Business Cards</Text>
        <Text style={styles.paragraph}>
          Tasama is a modern platform for creating and sharing digital business cards. Our mission is to bridge the gap between physical and digital networking, making it easier than ever to connect with professionals around the world.
        </Text>
        <Text style={styles.subtitle}>Our Vision</Text>
        <Text style={styles.paragraph}>
          We believe that networking should be seamless, eco-friendly, and powerful. By eliminating the need for paper cards, we help professionals reduce their carbon footprint while ensuring their contact information is always up-to-date and easily accessible.
        </Text>
        <Text style={styles.subtitle}>Key Features</Text>
        <View style={styles.featureList}>
          <FeatureItem icon="nfc" text="NFC-enabled card sharing" />
          <FeatureItem icon="qr-code" text="Instant QR code scanning" />
          <FeatureItem icon="sync" text="Real-time profile updates" />
          <FeatureItem icon="security" text="Secure data storage" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; text: string }) {
  return (
    <View style={styles.featureItem}>
      <MaterialIcons name={icon} size={20} color="#0B2B70" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B2B70",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 12,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0B2B70",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
    marginBottom: 16,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
});
