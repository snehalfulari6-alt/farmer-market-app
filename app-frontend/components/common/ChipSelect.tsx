import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: string[];
  multiple?: boolean;
  onChange: (values: string[]) => void;
};

export default function ChipSelect({
  options,
  selected,
  multiple = true,
  onChange,
}: Props) {
  const toggle = (value: string) => {
    const exists = selected.includes(value);
    if (multiple) {
      onChange(exists ? selected.filter((v) => v !== value) : [...selected, value]);
      return;
    }

    onChange(exists ? [] : [value]);
  };

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => toggle(option.value)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  textActive: {
    color: Colors.primary,
  },
});
