import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

interface AuthScreenWrapperProps {
  children: React.ReactNode;
}

const AuthScreenWrapper = ({ children }: AuthScreenWrapperProps) => {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: Colors.primaryDark }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={20}
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView >
  );
};

export default AuthScreenWrapper;
