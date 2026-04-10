import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/colors";
import type { Listing } from "@/services/listing";

type Props = {
  item: Listing;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

export default function ListingCard({ item, onPressEdit, onPressDelete }: Props) {
  const statusTone =
    item.status === "SOLD"
      ? {
        bg: "#FDECCE",
        fg: "#B26A00",
        label: "SOLD OUT",
      }
      : {
        bg: "#E8F5E9",
        fg: "#2E7D32",
        label: "ACTIVE",
      };

  return (
    <View style={styles.cardWrap}>
      <View style={styles.cardGlow} />
      <View style={styles.card}>
      <Image
        source={{ uri: item.photos[0] || "https://via.placeholder.com/120" }}
        style={styles.thumb}
        contentFit="cover"
      />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>
              {item.cropName}
            </Text>
            <Text style={styles.category}>{item.category?.name ?? "Uncategorized"}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: statusTone.bg }]}>
            <Text style={[styles.badgeText, { color: statusTone.fg }]}>{statusTone.label}</Text>
          </View>
        </View>

        <Text style={styles.price}>Rs {item.pricePerUnit.toFixed(0)} / {item.unit}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="cube-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.meta}>{item.quantity} {item.unit} available</Text>
        </View>

        {item.locationName ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.meta}>{item.locationName}</Text>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryBtn} onPress={onPressEdit}>
            <Ionicons name="create-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.secondaryText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={onPressDelete}>
            <Ionicons name="trash-outline" size={14} color={Colors.error} />
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    position: "relative",
  },
  cardGlow: {
    position: "absolute",
    left: 8,
    right: 8,
    top: 8,
    bottom: -2,
    borderRadius: 16,
    backgroundColor: "#E6EFE8",
  },
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    gap: 12,
    overflow: "hidden",
  },
  thumb: {
    width: 102,
    height: 102,
    borderRadius: 12,
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
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  category: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  price: {
    marginTop: 6,
    fontSize: 21,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.2,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  meta: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  secondaryBtn: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
  },
  secondaryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  deleteBtn: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.errorLight,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  deleteText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: "700",
  },
});
