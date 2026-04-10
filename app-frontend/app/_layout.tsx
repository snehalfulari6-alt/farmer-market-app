import { Stack } from "expo-router";
import "../global.css";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/constants/colors";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ToastContainer } from "react-native-toast-message-ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Layout />
          <ToastContainer position="top" topOffset={50} visibilityTime={3000} />
        </QueryClientProvider>
      </AuthProvider>
    </KeyboardProvider>
  );
}

function Layout() {
  const { user, isLoading, hasProfile, isProfileLoading, isProfileChecked } = useAuth();

  const isFarmer = user?.role === "FARMER";
  const hasRole = !!user?.role;

  if (isLoading || !isProfileChecked) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isLoggedIn = !!user;
  const needsFarmerProfile = isFarmer && !isProfileLoading && !hasProfile;
  const canAccessTabs = isLoggedIn && hasRole && !needsFarmerProfile;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Protected guard={!canAccessTabs}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={canAccessTabs}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
