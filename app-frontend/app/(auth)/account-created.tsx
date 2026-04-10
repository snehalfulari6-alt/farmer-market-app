import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/colors";

export default function AccountCreatedScreen() {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace("/(tabs)");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.checkWrap}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Account Created Successfully!</Text>
        <Text style={styles.subtitle}>Your farmer profile is ready</Text>
        <Text style={styles.redirectText}>
          Redirecting to dashboard in {secondsLeft}s...
        </Text>

        <Pressable
          style={styles.ctaButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.ctaText}>Go to Dashboard</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
  },
  checkWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primarySurface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  checkIcon: {
    fontSize: 44,
    fontWeight: "800",
    color: Colors.success,
    lineHeight: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  redirectText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  ctaButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textOnAccent,
  },
});
