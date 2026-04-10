import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/constants/colors";
import type { Listing } from "@/services/listing";

type Props = {
  item: Listing;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

export default function ListingCard({ item, onPressEdit, onPressDelete }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.photos[0] || "https://via.placeholder.com/120" }}
        style={styles.thumb}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.cropName}
          </Text>
          <View style={[styles.badge, item.status === "SOLD" ? styles.badgeSold : styles.badgeActive]}>
            <Text style={[styles.badgeText, item.status === "SOLD" ? styles.badgeTextSold : styles.badgeTextActive]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.price}>Rs {item.pricePerUnit.toFixed(0)} / {item.unit}</Text>
        <Text style={styles.meta}>{item.quantity} {item.unit} available</Text>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryBtn} onPress={onPressEdit}>
            <Text style={styles.secondaryText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={onPressDelete}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 10,
    gap: 10,
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeActive: {
    backgroundColor: Colors.successLight,
  },
  badgeSold: {
    backgroundColor: Colors.warningLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextActive: {
    color: Colors.success,
  },
  badgeTextSold: {
    color: Colors.warning,
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  secondaryBtn: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  deleteBtn: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.errorLight,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: "700",
  },
});
