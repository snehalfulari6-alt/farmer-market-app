import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Toast } from "react-native-toast-message-ts";
import { Colors } from "@/constants/colors";
import PhotoCarousel from "@/components/listing/PhotoCarousel";
import {
  deleteListing,
  getListingById,
  type Listing,
  updateListingStatus,
} from "@/services/listing";

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [item, setItem] = useState<Listing | null>(null);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getListingById(id);
      setItem(data);
    } catch (err) {
      Toast.show({ type: "error", text1: "Load Failed", text2: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const onMarkSold = async () => {
    if (!id) return;
    setUpdating(true);
    try {
      const updated = await updateListingStatus(id, "SOLD");
      setItem(updated);
      Toast.show({ type: "success", text1: "Updated", text2: "Listing marked as sold" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Update Failed", text2: (err as Error).message });
    } finally {
      setUpdating(false);
    }
  };

  const onDelete = () => {
    if (!id) return;
    Alert.alert("Delete Listing", "This listing will be hidden from active views.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setUpdating(true);
          try {
            await deleteListing(id);
            Toast.show({ type: "success", text1: "Deleted", text2: "Listing removed" });
            router.replace("/(tabs)/listings");
          } catch (err) {
            Toast.show({
              type: "error",
              text1: "Delete Failed",
              text2: (err as Error).message,
            });
          } finally {
            setUpdating(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.loaderWrap}>
        <Text style={styles.empty}>Listing not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PhotoCarousel photos={item.photos} />

      <Text style={styles.title}>{item.cropName}</Text>
      <Text style={styles.category}>{item.category?.name ?? "Uncategorized"}</Text>

      <Text style={styles.price}>Rs {item.pricePerUnit.toFixed(0)} / {item.unit}</Text>
      <Text style={styles.meta}>Quantity: {item.quantity} {item.unit}</Text>
      <Text style={styles.meta}>Status: {item.status}</Text>

      {item.locationName ? <Text style={styles.meta}>Location: {item.locationName}</Text> : null}

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.secondaryBtn, updating && { opacity: 0.7 }]}
          disabled={updating}
          onPress={() =>
            Toast.show({ type: "info", text1: "Coming Soon", text2: "Edit form in next iteration" })
          }
        >
          <Text style={styles.secondaryText}>Edit</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, updating && { opacity: 0.7 }]}
          disabled={updating || item.status === "SOLD"}
          onPress={onMarkSold}
        >
          <Text style={styles.primaryText}>Mark Sold</Text>
        </Pressable>

        <Pressable
          style={[styles.deleteBtn, updating && { opacity: 0.7 }]}
          disabled={updating}
          onPress={onDelete}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    gap: 8,
    paddingBottom: 24,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  empty: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 8,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  price: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
  },
  meta: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  secondaryText: {
    color: Colors.textSecondary,
    fontWeight: "700",
    fontSize: 13,
  },
  primaryBtn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.textOnPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  deleteBtn: {
    flex: 1,
    minHeight: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.errorLight,
  },
  deleteText: {
    color: Colors.error,
    fontWeight: "700",
    fontSize: 13,
  },
});
