import React, { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

interface AuthPasswordInputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label: string;
  labelRight?: React.ReactNode;
}

const AuthPasswordInput = forwardRef<TextInput, AuthPasswordInputProps>(
  ({ label, labelRight, style, ...props }, ref) => {
    const [secureText, setSecureText] = useState(true);

    return (
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
            marginLeft: 2,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.textSecondary,
            }}
          >
            {label}
          </Text>
          {labelRight}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 12,
            backgroundColor: Colors.surfaceAlt,
            paddingHorizontal: 14,
          }}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={Colors.textMuted}
            secureTextEntry={secureText}
            style={[
              {
                flex: 1,
                fontSize: 15,
                color: Colors.text,
                paddingVertical: 14,
                paddingRight: 36,
              },
              style,
            ]}
            {...props}
          />
          <Pressable
            onPress={() => setSecureText((current) => !current)}
            style={{
              position: "absolute",
              right: 14,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={secureText ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
    );
  },
);

AuthPasswordInput.displayName = "AuthPasswordInput";

export default AuthPasswordInput;
