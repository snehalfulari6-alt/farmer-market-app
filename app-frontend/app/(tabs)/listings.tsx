import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Toast } from "react-native-toast-message-ts";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import ListingCard from "@/components/listing/ListingCard";
import {
  deleteListing,
  getMyListings,
  type Listing,
  type ListingStatus,
} from "@/services/listing";

const FILTERS: { label: string; value: "ALL" | Exclude<ListingStatus, "DELETED"> }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Sold", value: "SOLD" },
];

export default function ListingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"ALL" | Exclude<ListingStatus, "DELETED">>("ALL");
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyListings(filter === "ALL" ? undefined : filter);
      setItems(data);
    } catch (err) {
      Toast.show({ type: "error", text1: "Load Failed", text2: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, [filter]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [filter]),
  );

  const onDelete = (id: string) => {
    Alert.alert("Delete Listing", "Are you sure you want to delete this listing?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteListing(id);
            Toast.show({ type: "success", text1: "Deleted", text2: "Listing removed" });
            load();
          } catch (err) {
            Toast.show({
              type: "error",
              text1: "Delete Failed",
              text2: (err as Error).message,
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>My Listings</Text>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Pressable
              key={f.value}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPressEdit={() =>
              router.push({ pathname: "/(tabs)/listing/[id]", params: { id: item.id } } as any)
            }
            onPressDelete={() => onDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptySubtitle}>Post your produce from the Post tab</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  filterTextActive: {
    color: Colors.primary,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyBox: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
