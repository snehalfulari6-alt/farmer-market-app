import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Toast } from "react-native-toast-message-ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/auth-context";
import DashboardHeader from "@/components/home/DashboardHeader";
import MarketPriceCard from "@/components/home/MarketPriceCard";
import QuickActionGrid from "@/components/home/QuickActionGrid";
import RecentActivity from "@/components/home/RecentActivity";
import MarketNews from "@/components/home/MarketNews";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const quickActions = [
    {
      key: "post",
      label: "Post Produce",
      icon: "add-circle-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.primary,
      onPress: () => router.push("/(tabs)/post"),
    },
    {
      key: "requests",
      label: "Live Requests",
      icon: "chatbubbles-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.statusConfirmed,
      onPress: () => router.push("/(tabs)/requests"),
    },
    {
      key: "listings",
      label: "My Listings",
      icon: "list-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.warning,
      onPress: () => router.push("/(tabs)/listings"),
    },
    {
      key: "orders",
      label: "My Orders",
      icon: "cube-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.statusDispatched,
      onPress: () =>
        Toast.show({ type: "info", text1: "Coming Soon", text2: "Orders will be added in F15" }),
    },
    {
      key: "wallet",
      label: "Wallet",
      icon: "wallet-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.success,
      onPress: () =>
        Toast.show({ type: "info", text1: "Coming Soon", text2: "Wallet is planned for later phase" }),
    },
    {
      key: "account",
      label: "My Account",
      icon: "person-outline" as keyof typeof Ionicons.glyphMap,
      color: Colors.info,
      onPress: () => router.push("/(tabs)/profile"),
    },
  ];

  const marketPrices = [
    { name: "Wheat", price: "Rs 2,250 / Qt", change: "+1.8%", up: true },
    { name: "Rice", price: "Rs 2,480 / Qt", change: "-0.7%", up: false },
    { name: "Onion", price: "Rs 1,940 / Qt", change: "+3.1%", up: true },
    { name: "Tomato", price: "Rs 1,620 / Qt", change: "-1.2%", up: false },
  ];

  const newsItems = [
    {
      id: "1",
      title: "MSP procurement window opens across major mandis",
      date: "10 Apr 2026",
    },
    {
      id: "2",
      title: "Rain forecast may impact wheat arrivals this week",
      date: "09 Apr 2026",
    },
    {
      id: "3",
      title: "Transport rates dip for inter-district produce delivery",
      date: "08 Apr 2026",
    },
  ];

  return (
    <View style={styles.container}>
      <DashboardHeader
        name={user?.name ?? "Farmer"}
        topInset={insets.top}
        onPressNotifications={() =>
          Toast.show({ type: "info", text1: "No Notifications", text2: "You're all caught up" })
        }
        onPressLogout={signOut}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionTitle title="Market Prices" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceRow}
        >
          {marketPrices.map((item) => (
            <MarketPriceCard
              key={item.name}
              name={item.name}
              price={item.price}
              change={item.change}
              up={item.up}
            />
          ))}
        </ScrollView>

        <SectionTitle title="Quick Actions" />
        <QuickActionGrid items={quickActions} />

        <SectionTitle title="Recent Activity" />
        <RecentActivity pending={2} active={1} completed={0} />

        <SectionTitle title="Market News" />
        <MarketNews items={newsItems} />
      </ScrollView>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 10,
  },
  priceRow: {
    paddingRight: 6,
  },
});
