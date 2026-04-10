import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/colors";

interface RoleChipProps {
  selectedRole: "FARMER" | "BUYER";
  onSelect: (role: "FARMER" | "BUYER") => void;
}

const RoleChip = ({ selectedRole, onSelect }: RoleChipProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onSelect("FARMER")}
        style={[
          styles.chip,
          selectedRole === "FARMER" && styles.chipActive,
        ]}
      >
        <Text style={styles.emoji}>🧑‍🌾</Text>
        <Text
          style={[
            styles.chipText,
            selectedRole === "FARMER" && styles.chipTextActive,
          ]}
        >
          Farmer
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onSelect("BUYER")}
        style={[
          styles.chip,
          selectedRole === "BUYER" && styles.chipActive,
        ]}
      >
        <Text style={styles.emoji}>🛒</Text>
        <Text
          style={[
            styles.chipText,
            selectedRole === "BUYER" && styles.chipTextActive,
          ]}
        >
          Buyer
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
  },
});

export default RoleChip;
