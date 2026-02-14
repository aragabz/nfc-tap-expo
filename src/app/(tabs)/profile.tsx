import Icons from "@/assets/icons";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isOffline, session } = useAuth();
  const { profile, loading, error, clearError, loadProfile } = useProfile();
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userId = profile?.id || user?.id;
  const onLogoutPress = useCallback(() => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout? This will clear your local profile data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: signOut,
        },
      ],
    );
  }, [signOut]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  const displayName = useMemo(() => {
    return profile?.fullName || user?.fullName || "";
  }, [profile?.fullName, user?.fullName]);

  const jobTitle = useMemo(() => {
    return profile?.jobTitle || user?.jobTitle || "";
  }, [profile?.jobTitle, user?.jobTitle]);

  const email = useMemo(() => {
    return profile?.email || user?.email || "";
  }, [profile?.email, user?.email]);

  const phoneNumber = profile?.phoneNumber || "";

  const initials = useMemo(() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase() || "U";
  }, [displayName]);

  const shareText = useMemo(() => {
    const lines = [displayName, jobTitle, email, phoneNumber].filter(Boolean);
    return lines.join("\n");
  }, [displayName, email, jobTitle, phoneNumber]);

  const qrValue = useMemo(() => {
    if (!userId || !displayName) return "";
    const socialLinks: string[] = [];
    if (profile?.socialLinks?.linkedin)
      socialLinks.push(profile.socialLinks.linkedin);
    if (profile?.socialLinks?.twitter)
      socialLinks.push(profile.socialLinks.twitter);
    if (profile?.socialLinks?.github)
      socialLinks.push(profile.socialLinks.github);
    socialLinks.push("https://tasama.com.sa");

    const cardPayload = {
      id: profile?.id || userId,
      fullName: displayName,
      jobTitle: jobTitle || undefined,
      company: profile?.organization || undefined,
      phone: phoneNumber || undefined,
      email: email || undefined,
      socialLinks: socialLinks.filter(Boolean),
      version: "1.0",
    };

    return JSON.stringify(cardPayload);
  }, [
    displayName,
    email,
    jobTitle,
    phoneNumber,
    profile?.id,
    profile?.organization,
    profile?.socialLinks?.github,
    profile?.socialLinks?.linkedin,
    profile?.socialLinks?.twitter,
    userId,
  ]);

  const onPressShare = useCallback(async () => {
    try {
      if (!shareText) return;
      await Share.share({ message: shareText });
    } catch {
      Alert.alert("Share", "Unable to share right now.");
    }
  }, [shareText]);

  const onPressQr = useCallback(() => {
    if (!qrValue) {
      Alert.alert("QR", "Profile data is not ready yet.");
      return;
    }
    setIsQrVisible(true);
  }, [qrValue]);

  const onPressDownload = useCallback(() => {
    Alert.alert("Download", "Download feature will be available soon.");
  }, []);

  const openUrl = useCallback(async (url: string) => {
    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
    const normalized = hasScheme
      ? url
      : url.startsWith("http")
        ? url
        : `https://${url}`;
    const supported = await Linking.canOpenURL(normalized);
    if (supported) {
      await Linking.openURL(normalized);
    }
  }, []);

  // If we are not online and don't have a session AND don't have a cached profile,
  // then we really shouldn't be here, but let the layout handle the redirect.
  // If we have a profile but no user object (offline case), we should still render.
  if (!session && isOffline && !profile) {
    return <LoadingOverlay message="Loading offline profile..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.topHeader}>
        <View style={{ width: 40 }} />
        <Icons.TasamaLogoSVG />
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/settings")}
          style={styles.settingsButton}
        >
          <MaterialIcons name="settings" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView
        bounces={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.name}>{displayName || " "}</Text>
          {!!jobTitle && <Text style={styles.title}>{jobTitle}</Text>}

          <View style={styles.actionsRow}>
            <ActionButton icon="file-download" onPress={onPressDownload} />
            <ActionButton icon="qr-code" onPress={onPressQr} />
            <ActionButton icon="share" onPress={onPressShare} />
          </View>
        </View>

        <View style={styles.sheet}>
          {!!error && (
            <TouchableOpacity
              onPress={clearError}
              activeOpacity={0.9}
              style={styles.errorBanner}
            >
              <Text style={styles.errorText}>{error}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionHeader}>Contact Information</Text>
          {!!email && (
            <InfoCard
              icon="email"
              label="Email"
              value={email}
              onPress={() => openUrl(`mailto:${email}`)}
            />
          )}
          {!!phoneNumber && (
            <InfoCard
              icon="phone"
              label="Phone"
              value={phoneNumber}
              onPress={() => openUrl(`tel:${phoneNumber}`)}
            />
          )}

          <Text style={[styles.sectionHeader, styles.sectionHeaderSpacing]}>
            Tasama Website & Social Media
          </Text>

          <View style={styles.socialGrid}>
            {!!profile?.socialLinks?.linkedin && (
              <SocialCard
                icon="business"
                label="linkedin"
                onPress={() => openUrl(profile.socialLinks!.linkedin!)}
              />
            )}
            {!!profile?.socialLinks?.twitter && (
              <SocialCard
                icon="close"
                label="X"
                onPress={() => openUrl(profile.socialLinks!.twitter!)}
              />
            )}
            {!!profile?.socialLinks?.github && (
              <SocialCard
                icon="code"
                label="github"
                onPress={() => openUrl(profile.socialLinks!.github!)}
              />
            )}
            <SocialCard
              icon="language"
              label="tasama.com.sa"
              onPress={() => openUrl("https://tasama.com.sa")}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.version}>
            v{Constants.expoConfig?.version || "1.0.0"}
          </Text>
        </View>
      </ScrollView>
      {loading && !refreshing && (
        <LoadingOverlay message="Loading profile..." />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isQrVisible}
        onRequestClose={() => setIsQrVisible(false)}
      >
        <Pressable
          style={qrStyles.overlay}
          onPress={() => setIsQrVisible(false)}
        >
          <Pressable style={qrStyles.sheet} onPress={() => {}}>
            <View style={qrStyles.header}>
              <Text style={qrStyles.title}>My QR Code</Text>
              <TouchableOpacity
                onPress={() => setIsQrVisible(false)}
                style={qrStyles.closeButton}
              >
                <Text style={qrStyles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={qrStyles.qrContainer}>
              <View style={qrStyles.qrWrapper}>
                <QRCode
                  value={qrValue}
                  size={240}
                  color="black"
                  backgroundColor="white"
                />
              </View>
              <Text style={qrStyles.hint}>Scan to receive my card</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B2B70",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 26,
    alignItems: "center",
  },
  logo: {
    width: 280,
    height: 56,
  },
  avatar: {
    marginTop: 26,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#E8EDF7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#6B7280",
    fontSize: 36,
    fontWeight: "700",
  },
  name: {
    marginTop: 18,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  title: {
    marginTop: 8,
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 14,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionHeaderSpacing: {
    marginTop: 18,
  },
  socialGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  logoutButton: {
    marginTop: 22,
    backgroundColor: "#0B2B70",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  version: {
    marginTop: 10,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },
  errorBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 12,
  },
  errorText: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
  },
});

function ActionButton({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={actionStyles.button}
    >
      <MaterialIcons name={icon} size={22} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const actionStyles = StyleSheet.create({
  button: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#8BC34A",
    alignItems: "center",
    justifyContent: "center",
  },
});

function InfoCard({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={infoStyles.card}
    >
      <View style={infoStyles.iconWrap}>
        <MaterialIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={infoStyles.textWrap}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
}

const infoStyles = StyleSheet.create({
  card: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8BC34A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    marginTop: 4,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
});

function SocialCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={socialStyles.card}
    >
      <View style={socialStyles.iconWrap}>
        <MaterialIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <Text style={socialStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const socialStyles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#8BC34A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "800",
  },
});

const qrStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 26,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  closeButton: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  qrContainer: {
    alignItems: "center",
    paddingTop: 14,
  },
  qrWrapper: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  hint: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
