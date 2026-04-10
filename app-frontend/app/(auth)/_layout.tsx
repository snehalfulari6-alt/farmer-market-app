import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/colors";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="farmer-registration" />
      <Stack.Screen name="account-created" />
    </Stack>
  );
};

export default AuthLayout;
