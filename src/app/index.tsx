import Icons from "@/assets/icons";
import { ThemedView } from "@/components/themed-view";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  return (
    <ThemedView style={styles.container} safeArea={false}>
      <View style={styles.content}>
        <Icons.TasamaLogoSVG
          style={{
            paddingTop: 40,
          }}
        />
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B2B70",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  loader: {
    marginTop: 60,
  },
});
