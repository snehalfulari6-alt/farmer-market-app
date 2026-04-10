import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/colors";

type Props = {
  name: string;
  topInset?: number;
  onPressNotifications: () => void;
  onPressLogout: () => void;
};

export default function DashboardHeader({
  name,
  topInset = 0,
  onPressNotifications,
  onPressLogout,
}: Props) {
  return (
    <View style={[styles.header, { paddingTop: 16 + topInset }]}>
      <View>
        <Text style={styles.greeting}>Hello, {name}!</Text>
        <Text style={styles.subtitle}>Welcome to FarmBridge</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onPressNotifications} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={20} color={Colors.textOnPrimary} />
        </Pressable>
        <Pressable onPress={onPressLogout} style={styles.iconBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.textOnPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: Colors.textOnPrimary,
    fontSize: 23,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
