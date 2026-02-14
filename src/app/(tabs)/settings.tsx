import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View style={styles.backButton} />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <SettingItem
            icon="info-outline"
            label="Version"
            value={version}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Legal</Text>
          <SettingItem
            icon="description"
            label="About Tasama"
            onPress={() => {
              router.push("/about");
            }}
          />
          <SettingItem
            icon="gavel"
            label="Terms & Conditions"
            onPress={() => {
              router.push("/terms");
            }}
          />
          <SettingItem
            icon="privacy-tip"
            label="Privacy Policy"
            onPress={() => {
              router.push("/privacy");
            }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Tasama Digital Business Cards
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.item}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={22} color="#0B2B70" />
        </View>
        <Text style={styles.itemLabel}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        {value ? (
          <Text style={styles.itemValue}>{value}</Text>
        ) : (
          onPress && <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
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
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8EDF7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
