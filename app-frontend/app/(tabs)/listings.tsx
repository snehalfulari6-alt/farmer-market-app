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
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  deleteListing,
  getMyListings,
  type Listing,
  type ListingStatus,
} from "@/services/listing";

const FILTERS: { label: string; value: "ALL" | ListingStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Sold", value: "SOLD" },
  { label: "Inactive", value: "DELETED" },
];

export default function ListingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<"ALL" | ListingStatus>("ALL");
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyListings(filter === "ALL" ? undefined : filter);
      setItems(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Load Failed",
        text2: (err as Error).message,
      });
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
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(id);
              Toast.show({
                type: "success",
                text1: "Deleted",
                text2: "Listing removed",
              });
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
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={styles.headerTitle}>My Listings</Text>
          <Text style={styles.headerSubtitle}>
            Track and manage your produce posts
          </Text>
        </View>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <Pressable
                key={f.value}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(f.value)}
              >
                <Text
                  style={[styles.filterText, active && styles.filterTextActive]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={load} />
          }
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ListingCard
              item={item}
              onPressEdit={() =>
                router.push({
                  pathname: "/(tabs)/listing/[id]",
                  params: { id: item.id },
                } as any)
              }
              onPressDelete={() => onDelete(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySubtitle}>
                Post your produce from the Post tab
              </Text>
            </View>
          }
        />
      </View>

      <Pressable style={styles.fab} onPress={() => router.push("/(tabs)/post")}>
        <Ionicons name="add" size={28} color={Colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: Colors.textOnPrimary,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
  headerRightIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  contentCard: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  title: {
    display: "none",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  hero: {
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: "#F3F3F3",
    borderRadius: 14,
    padding: 4,
  },
  filterChip: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: Colors.surface,
  },
  filterText: {
    fontSize: 17,
    color: "#A8AEB5",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#4C5661",
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 2,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8C8C8C",
    alignItems: "center",
    justifyContent: "center",
  },
});
