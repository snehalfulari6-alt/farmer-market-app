import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/colors";

type Props = {
  name: string;
  price: string;
  change: string;
  up: boolean;
};

export default function MarketPriceCard({ name, price, change, up }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price}</Text>
      <View style={styles.changeRow}>
        <Ionicons
          name={up ? "trending-up" : "trending-down"}
          size={14}
          color={up ? Colors.success : Colors.error}
        />
        <Text style={[styles.change, { color: up ? Colors.success : Colors.error }]}>{change}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  price: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  changeRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: "700",
  },
});
