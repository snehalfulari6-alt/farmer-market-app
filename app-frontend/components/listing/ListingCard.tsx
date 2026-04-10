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
      ? { bg: "#DFDFDF", fg: "#6D7480", label: "Sold" }
      : item.status === "DELETED"
        ? { bg: "#DFDFDF", fg: "#6D7480", label: "Inactive" }
        : { bg: "#DFDFDF", fg: "#2E7D32", label: "Active" };

  return (
    <View style={styles.card}>
      {item.photos[0] ? (
        <Image source={{ uri: item.photos[0] }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.cropName}
          </Text>

          <View style={[styles.badge, { backgroundColor: statusTone.bg }]}>
            <Text style={[styles.badgeText, { color: statusTone.fg }]}>{statusTone.label}</Text>
          </View>

          <Pressable style={styles.iconBtn} onPress={onPressEdit}>
            <Ionicons name="create-outline" size={18} color={Colors.edit} />
          </Pressable>

          <Pressable style={styles.iconBtn} onPress={onPressDelete}>
            <Ionicons name="trash-outline" size={18} color={Colors.delete} />
          </Pressable>
        </View>

        <View style={{
          flex: 1,
          flexDirection: "row",
          gap: 10,
          marginTop: 2
        }}>
          <Text style={styles.priceLine}>Price: {item.pricePerUnit.toFixed(0)}/{item.unit}</Text>
          <Text style={styles.qtyLine}>|</Text>
          <Text style={styles.qtyLine}>Qty: {item.quantity} {item.unit}</Text>
        </View>
        <Text
          style={styles.qtyLine}>Grade: {item.grade}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    gap: 12,
  },
  thumb: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: "#D8D8D8",
  },
  thumbPlaceholder: {
    borderWidth: 0,
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    marginTop: 10,
    height: 10,
    width: "58%",
    borderRadius: 999,
    backgroundColor: "#E6E6E6",
    overflow: "hidden",
  },
  progressFill: {
    width: "62%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#D4D4D4",
  },
  priceLine: {
    fontSize: 16,
    color: "#6B7785",
    lineHeight: 24,
  },
  qtyLine: {
    fontSize: 16,
    color: "#6B7785",
    lineHeight: 24,
  },
});
